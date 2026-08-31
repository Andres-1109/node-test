import { Transaction } from 'sequelize';
import { sequelize, User, Clinic, Warehouse, Medication } from '../models';
import { UserRole } from '../models/enums';

interface SeedUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface SeedClinicInput {
  name: string;
  taxId: string;
  managerName: string;
}

interface SeedWarehouseInput {
  name: string;
  location: string;
}

interface SeedMedicationInput {
  name: string;
  description: string;
  warehouseId: number;
  availableQuantity: number;
}

export class SeedRepository {
  /**
   * Runs a unit of work inside a single database transaction.
   * @param work - The operations to run atomically.
   * @returns Whatever `work` resolves to.
   */
  public async runInTransaction<T>(work: (transaction: Transaction) => Promise<T>): Promise<T> {
    return sequelize.transaction(work);
  }

  public async bulkInsertUsers(users: SeedUserInput[], transaction: Transaction): Promise<User[]> {
    return User.bulkCreate(users, { transaction });
  }

  public async bulkInsertClinics(clinics: SeedClinicInput[], transaction: Transaction): Promise<Clinic[]> {
    return Clinic.bulkCreate(clinics, { transaction });
  }

  public async bulkInsertWarehouses(warehouses: SeedWarehouseInput[], transaction: Transaction): Promise<Warehouse[]> {
    return Warehouse.bulkCreate(warehouses, { transaction });
  }

  public async bulkInsertMedications(
    medications: SeedMedicationInput[],
    transaction: Transaction
  ): Promise<Medication[]> {
    return Medication.bulkCreate(medications, { transaction });
  }
}
