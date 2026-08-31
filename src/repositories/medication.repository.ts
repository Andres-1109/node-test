import { Medication } from '../models';
import { CreateMedicationDto, UpdateMedicationDto } from '../dtos/medication.dto';

export class MedicationRepository {
  public async findAllActive(): Promise<Medication[]> {
    return Medication.findAll({ where: { isActive: true } });
  }

  public async findById(id: number): Promise<Medication | null> {
    return Medication.findByPk(id);
  }

  public async create(data: CreateMedicationDto): Promise<Medication> {
    return Medication.create(data);
  }

  public async update(medication: Medication, data: UpdateMedicationDto): Promise<Medication> {
    return medication.update(data);
  }

  public async softDelete(medication: Medication): Promise<Medication> {
    return medication.update({ isActive: false });
  }
}
