import { Clinic } from '../models';
import { CreateClinicDto, UpdateClinicDto } from '../dtos/clinic.dto';

export class ClinicRepository {
  public async findAllActive(): Promise<Clinic[]> {
    return Clinic.findAll({ where: { isActive: true } });
  }

  public async findById(id: number): Promise<Clinic | null> {
    return Clinic.findByPk(id);
  }

  public async findByTaxId(taxId: string): Promise<Clinic | null> {
    return Clinic.findOne({ where: { taxId } });
  }

  public async create(data: CreateClinicDto): Promise<Clinic> {
    return Clinic.create(data);
  }

  public async update(clinic: Clinic, data: UpdateClinicDto): Promise<Clinic> {
    return clinic.update(data);
  }

  public async softDelete(clinic: Clinic): Promise<Clinic> {
    return clinic.update({ isActive: false });
  }
}
