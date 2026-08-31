import { SupplyRequest, Clinic, Warehouse, Medication, User } from '../models';
import { CreateSupplyRequestDto, UpdateSupplyRequestDto } from '../dtos/supplyRequest.dto';
import { SupplyRequestStatus } from '../models/enums';

const DETAIL_INCLUDE = [
  { model: Clinic, as: 'clinic' },
  { model: Warehouse, as: 'warehouse' },
  { model: Medication, as: 'medication' },
  { model: User, as: 'requestManager', attributes: { exclude: ['password'] } },
];

export class SupplyRequestRepository {
  public async findAllActive(): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({
      where: { isDeleted: false },
      include: DETAIL_INCLUDE,
      order: [['createdAt', 'DESC']],
    });
  }

  public async findById(id: number): Promise<SupplyRequest | null> {
    return SupplyRequest.findByPk(id, { include: DETAIL_INCLUDE });
  }

  public async findByClinicId(clinicId: number): Promise<SupplyRequest[]> {
    return SupplyRequest.findAll({ where: { clinicId }, include: DETAIL_INCLUDE, order: [['createdAt', 'DESC']] });
  }

  public async create(
    data: CreateSupplyRequestDto & { warehouseId: number; requestManagerId: number }
  ): Promise<SupplyRequest> {
    return SupplyRequest.create(data);
  }

  public async update(
    supplyRequest: SupplyRequest,
    data: UpdateSupplyRequestDto & { warehouseId?: number }
  ): Promise<SupplyRequest> {
    return supplyRequest.update(data);
  }

  public async updateStatus(supplyRequest: SupplyRequest, status: SupplyRequestStatus): Promise<SupplyRequest> {
    return supplyRequest.update({ status });
  }

  public async softDelete(supplyRequest: SupplyRequest): Promise<SupplyRequest> {
    return supplyRequest.update({ isDeleted: true });
  }
}
