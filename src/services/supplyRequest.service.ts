import { SupplyRequestRepository } from '../repositories/supplyRequest.repository';
import { ClinicRepository } from '../repositories/clinic.repository';
import { MedicationRepository } from '../repositories/medication.repository';
import {
  CreateSupplyRequestDto,
  UpdateSupplyRequestDto,
  UpdateSupplyRequestStatusDto,
} from '../dtos/supplyRequest.dto';
import { Medication, SupplyRequest } from '../models';
import { SupplyRequestStatus } from '../models/enums';
import { ConflictError, NotFoundError } from '../errors';
import { findActiveOrFail } from '../utils/findActiveOrFail';

const VALID_STATUS_TRANSITIONS: Record<SupplyRequestStatus, SupplyRequestStatus[]> = {
  pending: ['approved', 'rejected'],
  approved: ['completed'],
  rejected: [],
  completed: [],
};

export class SupplyRequestService {
  private readonly supplyRequestRepository: SupplyRequestRepository;
  private readonly clinicRepository: ClinicRepository;
  private readonly medicationRepository: MedicationRepository;

  constructor(
    supplyRequestRepository: SupplyRequestRepository = new SupplyRequestRepository(),
    clinicRepository: ClinicRepository = new ClinicRepository(),
    medicationRepository: MedicationRepository = new MedicationRepository()
  ) {
    this.supplyRequestRepository = supplyRequestRepository;
    this.clinicRepository = clinicRepository;
    this.medicationRepository = medicationRepository;
  }

  /**
   * Lists every non-deleted supply request.
   * @returns The active supply requests, with clinic/warehouse/medication/requestManager included.
   */
  public async listActive(): Promise<SupplyRequest[]> {
    return this.supplyRequestRepository.findAllActive();
  }

  /**
   * Retrieves a single supply request by ID.
   * @param id - The supply request ID.
   * @returns The supply request, with clinic/warehouse/medication/requestManager included.
   * @throws {NotFoundError} If no supply request exists with the given ID.
   */
  public async getById(id: number): Promise<SupplyRequest> {
    const supplyRequest = await this.supplyRequestRepository.findById(id);
    if (!supplyRequest) {
      throw new NotFoundError(`Supply request with ID ${id} was not found`);
    }
    return supplyRequest;
  }

  /**
   * Retrieves the full request history for a clinic, regardless of status or deletion state.
   * @param clinicId - The clinic ID.
   * @returns The clinic's supply requests, most recent first.
   * @throws {NotFoundError} If no clinic exists with the given ID.
   */
  public async getHistoryByClinic(clinicId: number): Promise<SupplyRequest[]> {
    const clinic = await this.clinicRepository.findById(clinicId);
    if (!clinic) {
      throw new NotFoundError(`Clinic with ID ${clinicId} was not found`);
    }
    return this.supplyRequestRepository.findByClinicId(clinicId);
  }

  /**
   * Creates a new supply request. The warehouse is derived from the requested medication.
   * @param data - The request payload (clinicId, medicationId, requestedQuantity).
   * @param requestManagerId - The ID of the authenticated user creating the request.
   * @returns The created supply request.
   * @throws {NotFoundError} If the clinic or medication does not exist or is inactive.
   * @throws {ConflictError} If requestedQuantity exceeds the medication's availableQuantity.
   */
  public async create(data: CreateSupplyRequestDto, requestManagerId: number): Promise<SupplyRequest> {
    await this.ensureActiveClinicExists(data.clinicId);
    const medication = await this.ensureActiveMedicationExists(data.medicationId);
    this.ensureInventoryIsAvailable(medication, data.requestedQuantity);

    return this.supplyRequestRepository.create({
      ...data,
      warehouseId: medication.warehouseId,
      requestManagerId,
    });
  }

  /**
   * Fully edits a supply request's business data (clinic, medication, requested quantity).
   * Status changes are handled exclusively by {@link updateStatus}.
   * @param id - The supply request ID.
   * @param data - The fields to update.
   * @returns The updated supply request.
   * @throws {NotFoundError} If the supply request, clinic, or medication does not exist.
   * @throws {ConflictError} If the resulting requestedQuantity exceeds the medication's availableQuantity.
   */
  public async fullUpdate(id: number, data: UpdateSupplyRequestDto): Promise<SupplyRequest> {
    const supplyRequest = await this.findNonDeletedOrFail(id);

    if (data.clinicId !== undefined) {
      await this.ensureActiveClinicExists(data.clinicId);
    }

    const medicationId = data.medicationId ?? supplyRequest.medicationId;
    const medication = await this.ensureActiveMedicationExists(medicationId);

    const requestedQuantity = data.requestedQuantity ?? supplyRequest.requestedQuantity;
    this.ensureInventoryIsAvailable(medication, requestedQuantity);

    return this.supplyRequestRepository.update(supplyRequest, {
      ...data,
      warehouseId: medication.warehouseId,
    });
  }

  /**
   * Updates a supply request's business workflow status, enforcing the allowed transitions.
   * @param id - The supply request ID.
   * @param data - The target status.
   * @returns The updated supply request.
   * @throws {NotFoundError} If no non-deleted supply request exists with the given ID.
   * @throws {ConflictError} If the requested status transition is not allowed.
   */
  public async updateStatus(id: number, data: UpdateSupplyRequestStatusDto): Promise<SupplyRequest> {
    const supplyRequest = await this.findNonDeletedOrFail(id);
    this.ensureValidStatusTransition(supplyRequest.status, data.status);
    return this.supplyRequestRepository.updateStatus(supplyRequest, data.status);
  }

  /**
   * Logically deletes a supply request by setting isDeleted to true.
   * @param id - The supply request ID.
   * @throws {NotFoundError} If no non-deleted supply request exists with the given ID.
   */
  public async softDelete(id: number): Promise<void> {
    const supplyRequest = await this.findNonDeletedOrFail(id);
    await this.supplyRequestRepository.softDelete(supplyRequest);
  }

  private async findNonDeletedOrFail(id: number): Promise<SupplyRequest> {
    const supplyRequest = await this.supplyRequestRepository.findById(id);
    if (!supplyRequest || supplyRequest.isDeleted) {
      throw new NotFoundError(`Supply request with ID ${id} was not found`);
    }
    return supplyRequest;
  }

  private async ensureActiveClinicExists(clinicId: number): Promise<void> {
    await findActiveOrFail(() => this.clinicRepository.findById(clinicId), `Clinic with ID ${clinicId} was not found`);
  }

  private async ensureActiveMedicationExists(medicationId: number): Promise<Medication> {
    return findActiveOrFail(
      () => this.medicationRepository.findById(medicationId),
      `Medication with ID ${medicationId} was not found`
    );
  }

  private ensureInventoryIsAvailable(medication: Medication, requestedQuantity: number): void {
    if (requestedQuantity > medication.availableQuantity) {
      throw new ConflictError(
        `Requested quantity (${requestedQuantity}) exceeds available quantity (${medication.availableQuantity}) for medication "${medication.name}"`
      );
    }
  }

  private ensureValidStatusTransition(current: SupplyRequestStatus, next: SupplyRequestStatus): void {
    const allowedNextStatuses = VALID_STATUS_TRANSITIONS[current];
    if (!allowedNextStatuses.includes(next)) {
      throw new ConflictError(`Cannot transition supply request status from "${current}" to "${next}"`);
    }
  }
}
