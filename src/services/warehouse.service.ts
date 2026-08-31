import { WarehouseRepository } from '../repositories/warehouse.repository';
import { CreateWarehouseDto, UpdateWarehouseDto } from '../dtos/warehouse.dto';
import { Warehouse } from '../models';
import { NotFoundError } from '../errors';

export class WarehouseService {
  private readonly warehouseRepository: WarehouseRepository;

  constructor(warehouseRepository: WarehouseRepository = new WarehouseRepository()) {
    this.warehouseRepository = warehouseRepository;
  }

  /**
   * Lists every active warehouse.
   * @returns The active warehouses.
   */
  public async listActive(): Promise<Warehouse[]> {
    return this.warehouseRepository.findAllActive();
  }

  /**
   * Creates a new warehouse.
   * @param data - The warehouse payload (name, location).
   * @returns The created warehouse.
   */
  public async create(data: CreateWarehouseDto): Promise<Warehouse> {
    return this.warehouseRepository.create(data);
  }

  /**
   * Updates an existing warehouse.
   * @param id - The warehouse ID.
   * @param data - The fields to update.
   * @returns The updated warehouse.
   * @throws {NotFoundError} If no warehouse exists with the given ID.
   */
  public async update(id: number, data: UpdateWarehouseDto): Promise<Warehouse> {
    const warehouse = await this.findActiveOrFail(id);
    return this.warehouseRepository.update(warehouse, data);
  }

  /**
   * Logically deletes a warehouse by setting isActive to false.
   * @param id - The warehouse ID.
   * @throws {NotFoundError} If no warehouse exists with the given ID.
   */
  public async softDelete(id: number): Promise<void> {
    const warehouse = await this.findActiveOrFail(id);
    await this.warehouseRepository.softDelete(warehouse);
  }

  private async findActiveOrFail(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findById(id);
    if (!warehouse || !warehouse.isActive) {
      throw new NotFoundError(`Warehouse with ID ${id} was not found`);
    }
    return warehouse;
  }
}
