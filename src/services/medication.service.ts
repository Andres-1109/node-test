import { MedicationRepository } from '../repositories/medication.repository';
import { WarehouseRepository } from '../repositories/warehouse.repository';
import { CreateMedicationDto, UpdateMedicationDto } from '../dtos/medication.dto';
import { Medication } from '../models';
import { NotFoundError } from '../errors';

export class MedicationService {
  private readonly medicationRepository: MedicationRepository;
  private readonly warehouseRepository: WarehouseRepository;

  constructor(
    medicationRepository: MedicationRepository = new MedicationRepository(),
    warehouseRepository: WarehouseRepository = new WarehouseRepository()
  ) {
    this.medicationRepository = medicationRepository;
    this.warehouseRepository = warehouseRepository;
  }

  /**
   * Lists every active medication.
   * @returns The active medications.
   */
  public async listActive(): Promise<Medication[]> {
    return this.medicationRepository.findAllActive();
  }

  /**
   * Creates a new medication in a warehouse.
   * @param data - The medication payload (name, description, warehouseId, availableQuantity).
   * @returns The created medication.
   * @throws {NotFoundError} If the referenced warehouse does not exist or is inactive.
   */
  public async create(data: CreateMedicationDto): Promise<Medication> {
    await this.ensureWarehouseExists(data.warehouseId);
    return this.medicationRepository.create(data);
  }

  /**
   * Updates an existing medication.
   * @param id - The medication ID.
   * @param data - The fields to update.
   * @returns The updated medication.
   * @throws {NotFoundError} If no medication exists with the given ID, or the new warehouseId is invalid.
   */
  public async update(id: number, data: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.findActiveOrFail(id);
    if (data.warehouseId !== undefined) {
      await this.ensureWarehouseExists(data.warehouseId);
    }
    return this.medicationRepository.update(medication, data);
  }

  /**
   * Logically deletes a medication by setting isActive to false.
   * @param id - The medication ID.
   * @throws {NotFoundError} If no medication exists with the given ID.
   */
  public async softDelete(id: number): Promise<void> {
    const medication = await this.findActiveOrFail(id);
    await this.medicationRepository.softDelete(medication);
  }

  private async findActiveOrFail(id: number): Promise<Medication> {
    const medication = await this.medicationRepository.findById(id);
    if (!medication || !medication.isActive) {
      throw new NotFoundError(`Medication with ID ${id} was not found`);
    }
    return medication;
  }

  private async ensureWarehouseExists(warehouseId: number): Promise<void> {
    const warehouse = await this.warehouseRepository.findById(warehouseId);
    if (!warehouse || !warehouse.isActive) {
      throw new NotFoundError(`Warehouse with ID ${warehouseId} was not found`);
    }
  }
}
