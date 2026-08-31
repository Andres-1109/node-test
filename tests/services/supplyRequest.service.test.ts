import { SupplyRequestService } from '../../src/services/supplyRequest.service';
import { SupplyRequestRepository } from '../../src/repositories/supplyRequest.repository';
import { ClinicRepository } from '../../src/repositories/clinic.repository';
import { MedicationRepository } from '../../src/repositories/medication.repository';
import { Clinic, Medication, SupplyRequest } from '../../src/models';
import { ConflictError, NotFoundError } from '../../src/errors';

function createMockSupplyRequestRepository(): jest.Mocked<SupplyRequestRepository> {
  return {
    findAllActive: jest.fn(),
    findById: jest.fn(),
    findByClinicId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    softDelete: jest.fn(),
  } as unknown as jest.Mocked<SupplyRequestRepository>;
}

function createMockClinicRepository(): jest.Mocked<ClinicRepository> {
  return {
    findAllActive: jest.fn(),
    findById: jest.fn(),
    findByTaxId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  } as unknown as jest.Mocked<ClinicRepository>;
}

function createMockMedicationRepository(): jest.Mocked<MedicationRepository> {
  return {
    findAllActive: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  } as unknown as jest.Mocked<MedicationRepository>;
}

const activeClinic = { id: 9, isActive: true } as Clinic;

const medicationWithStock = {
  id: 4,
  name: 'Ibuprofen 400mg',
  warehouseId: 3,
  availableQuantity: 500,
  isActive: true,
} as Medication;

function buildSupplyRequest(overrides: Partial<SupplyRequest> = {}): SupplyRequest {
  return {
    id: 2,
    clinicId: 9,
    medicationId: 4,
    warehouseId: 3,
    requestManagerId: 6,
    requestedQuantity: 20,
    status: 'pending',
    isDeleted: false,
    ...overrides,
  } as SupplyRequest;
}

describe('SupplyRequestService', () => {
  let supplyRequestRepository: jest.Mocked<SupplyRequestRepository>;
  let clinicRepository: jest.Mocked<ClinicRepository>;
  let medicationRepository: jest.Mocked<MedicationRepository>;
  let service: SupplyRequestService;

  beforeEach(() => {
    supplyRequestRepository = createMockSupplyRequestRepository();
    clinicRepository = createMockClinicRepository();
    medicationRepository = createMockMedicationRepository();
    service = new SupplyRequestService(supplyRequestRepository, clinicRepository, medicationRepository);
  });

  describe('create', () => {
    it('creates a supply request with the warehouseId derived from the medication', async () => {
      clinicRepository.findById.mockResolvedValue(activeClinic);
      medicationRepository.findById.mockResolvedValue(medicationWithStock);
      supplyRequestRepository.create.mockResolvedValue(buildSupplyRequest());

      const result = await service.create({ clinicId: 9, medicationId: 4, requestedQuantity: 20 }, 6);

      expect(supplyRequestRepository.create).toHaveBeenCalledWith({
        clinicId: 9,
        medicationId: 4,
        requestedQuantity: 20,
        warehouseId: 3,
        requestManagerId: 6,
      });
      expect(result.status).toBe('pending');
    });

    it('throws NotFoundError when the clinic does not exist', async () => {
      clinicRepository.findById.mockResolvedValue(null);

      await expect(service.create({ clinicId: 999, medicationId: 4, requestedQuantity: 20 }, 6)).rejects.toThrow(
        NotFoundError
      );
      expect(medicationRepository.findById).not.toHaveBeenCalled();
      expect(supplyRequestRepository.create).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when the medication does not exist or is inactive', async () => {
      clinicRepository.findById.mockResolvedValue(activeClinic);
      medicationRepository.findById.mockResolvedValue(null);

      await expect(service.create({ clinicId: 9, medicationId: 999, requestedQuantity: 20 }, 6)).rejects.toThrow(
        NotFoundError
      );
      expect(supplyRequestRepository.create).not.toHaveBeenCalled();
    });

    it('throws ConflictError when requestedQuantity exceeds the medication availableQuantity', async () => {
      clinicRepository.findById.mockResolvedValue(activeClinic);
      medicationRepository.findById.mockResolvedValue(medicationWithStock);

      await expect(service.create({ clinicId: 9, medicationId: 4, requestedQuantity: 9999 }, 6)).rejects.toThrow(
        ConflictError
      );
      expect(supplyRequestRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('allows the pending -> approved transition', async () => {
      const pendingRequest = buildSupplyRequest({ status: 'pending' });
      supplyRequestRepository.findById.mockResolvedValue(pendingRequest);
      supplyRequestRepository.updateStatus.mockResolvedValue(buildSupplyRequest({ status: 'approved' }));

      const result = await service.updateStatus(2, { status: 'approved' });

      expect(supplyRequestRepository.updateStatus).toHaveBeenCalledWith(pendingRequest, 'approved');
      expect(result.status).toBe('approved');
    });

    it('rejects the pending -> completed transition', async () => {
      supplyRequestRepository.findById.mockResolvedValue(buildSupplyRequest({ status: 'pending' }));

      await expect(service.updateStatus(2, { status: 'completed' })).rejects.toThrow(ConflictError);
      expect(supplyRequestRepository.updateStatus).not.toHaveBeenCalled();
    });

    it('rejects any transition on an already-deleted supply request', async () => {
      supplyRequestRepository.findById.mockResolvedValue(buildSupplyRequest({ isDeleted: true }));

      await expect(service.updateStatus(2, { status: 'approved' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('getHistoryByClinic', () => {
    it('throws NotFoundError when the clinic does not exist', async () => {
      clinicRepository.findById.mockResolvedValue(null);

      await expect(service.getHistoryByClinic(999)).rejects.toThrow(NotFoundError);
      expect(supplyRequestRepository.findByClinicId).not.toHaveBeenCalled();
    });

    it('returns the clinic history regardless of status or deletion state', async () => {
      clinicRepository.findById.mockResolvedValue(activeClinic);
      const history = [buildSupplyRequest({ status: 'completed' }), buildSupplyRequest({ id: 3, isDeleted: true })];
      supplyRequestRepository.findByClinicId.mockResolvedValue(history);

      const result = await service.getHistoryByClinic(9);

      expect(result).toBe(history);
    });
  });
});
