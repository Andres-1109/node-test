import { Warehouse } from '../models';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../dtos/warehouse.dto';

export class WarehouseRepository {
  public async findAllActive(): Promise<Warehouse[]> {
    return Warehouse.findAll({ where: { isActive: true } });
  }

  public async findById(id: number): Promise<Warehouse | null> {
    return Warehouse.findByPk(id);
  }

  public async create(data: CreateWarehouseDto): Promise<Warehouse> {
    return Warehouse.create(data);
  }

  public async update(warehouse: Warehouse, data: UpdateWarehouseDto): Promise<Warehouse> {
    return warehouse.update(data);
  }

  public async softDelete(warehouse: Warehouse): Promise<Warehouse> {
    return warehouse.update({ isActive: false });
  }
}
