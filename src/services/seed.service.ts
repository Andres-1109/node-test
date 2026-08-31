import bcrypt from 'bcrypt';
import { SeedRepository } from '../repositories/seed.repository';
import { SeedDataDto, SeedSummaryDto } from '../dtos/seed.dto';
import { ValidationError } from '../errors';

const SALT_ROUNDS = 10;

export class SeedService {
  private readonly seedRepository: SeedRepository;

  constructor(seedRepository: SeedRepository = new SeedRepository()) {
    this.seedRepository = seedRepository;
  }

  /**
   * Seeds the database from a shape-validated JSON payload, in FK dependency order
   * (users, clinics, warehouses, then medications), inside a single transaction.
   * @param data - The parsed seed payload (users, clinics, warehouses, medications).
   * @returns A summary with the count of records inserted per entity.
   * @throws {ValidationError} If a medication references a warehouseKey absent from the payload's warehouses.
   */
  public async seed(data: SeedDataDto): Promise<SeedSummaryDto> {
    this.ensureMedicationsReferenceKnownWarehouseKeys(data);

    const usersWithHashedPasswords = await Promise.all(
      data.users.map(async (user) => ({ ...user, password: await bcrypt.hash(user.password, SALT_ROUNDS) }))
    );

    return this.seedRepository.runInTransaction(async (transaction) => {
      const users = await this.seedRepository.bulkInsertUsers(usersWithHashedPasswords, transaction);
      const clinics = await this.seedRepository.bulkInsertClinics(data.clinics, transaction);

      const warehouses = await this.seedRepository.bulkInsertWarehouses(
        data.warehouses.map(({ name, location }) => ({ name, location })),
        transaction
      );
      const warehouseIdByKey = new Map(data.warehouses.map((warehouse, index) => [warehouse.key, warehouses[index]!.id]));

      const medicationsToInsert = data.medications.map((medication) => ({
        name: medication.name,
        description: medication.description,
        availableQuantity: medication.availableQuantity,
        warehouseId: warehouseIdByKey.get(medication.warehouseKey)!,
      }));
      const medications = await this.seedRepository.bulkInsertMedications(medicationsToInsert, transaction);

      return {
        users: users.length,
        clinics: clinics.length,
        warehouses: warehouses.length,
        medications: medications.length,
      };
    });
  }

  private ensureMedicationsReferenceKnownWarehouseKeys(data: SeedDataDto): void {
    const warehouseKeys = new Set(data.warehouses.map((warehouse) => warehouse.key));
    const invalidMedication = data.medications.find((medication) => !warehouseKeys.has(medication.warehouseKey));
    if (invalidMedication) {
      throw new ValidationError(
        `Medication "${invalidMedication.name}" references warehouseKey "${invalidMedication.warehouseKey}", which is not present in the uploaded warehouses`
      );
    }
  }
}
