import { ClinicRepository } from '../repositories/clinic.repository';
import { CreateClinicDto, UpdateClinicDto } from '../dtos/clinic.dto';
import { Clinic } from '../models';
import { ConflictError, NotFoundError } from '../errors';

export class ClinicService {
  private readonly clinicRepository: ClinicRepository;

  constructor(clinicRepository: ClinicRepository = new ClinicRepository()) {
    this.clinicRepository = clinicRepository;
  }

  /**
   * Lists every active clinic.
   * @returns The active clinics.
   */
  public async listActive(): Promise<Clinic[]> {
    return this.clinicRepository.findAllActive();
  }

  /**
   * Creates a new clinic.
   * @param data - The clinic payload (name, taxId, managerName).
   * @returns The created clinic.
   * @throws {ConflictError} If a clinic with the same taxId already exists.
   */
  public async create(data: CreateClinicDto): Promise<Clinic> {
    await this.ensureTaxIdIsNotTaken(data.taxId);
    return this.clinicRepository.create(data);
  }

  /**
   * Updates an existing clinic.
   * @param id - The clinic ID.
   * @param data - The fields to update.
   * @returns The updated clinic.
   * @throws {NotFoundError} If no clinic exists with the given ID.
   * @throws {ConflictError} If the new taxId is already used by another clinic.
   */
  public async update(id: number, data: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findActiveOrFail(id);
    if (data.taxId !== undefined && data.taxId !== clinic.taxId) {
      await this.ensureTaxIdIsNotTaken(data.taxId);
    }
    return this.clinicRepository.update(clinic, data);
  }

  /**
   * Logically deletes a clinic by setting isActive to false.
   * @param id - The clinic ID.
   * @throws {NotFoundError} If no clinic exists with the given ID.
   */
  public async softDelete(id: number): Promise<void> {
    const clinic = await this.findActiveOrFail(id);
    await this.clinicRepository.softDelete(clinic);
  }

  private async findActiveOrFail(id: number): Promise<Clinic> {
    const clinic = await this.clinicRepository.findById(id);
    if (!clinic || !clinic.isActive) {
      throw new NotFoundError(`Clinic with ID ${id} was not found`);
    }
    return clinic;
  }

  private async ensureTaxIdIsNotTaken(taxId: string): Promise<void> {
    const existingClinic = await this.clinicRepository.findByTaxId(taxId);
    if (existingClinic) {
      throw new ConflictError(`A clinic with taxId "${taxId}" already exists`);
    }
  }
}
