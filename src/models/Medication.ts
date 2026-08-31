import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from 'sequelize';
import { sequelize } from '../config/sequelize';
import { Warehouse } from './Warehouse';
import type { SupplyRequest } from './SupplyRequest';

export class Medication extends Model<InferAttributes<Medication>, InferCreationAttributes<Medication>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare warehouseId: ForeignKey<Warehouse['id']>;
  declare availableQuantity: number;
  declare isActive: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare warehouse?: NonAttribute<Warehouse>;
  declare supplyRequests?: NonAttribute<SupplyRequest[]>;
}

Medication.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Warehouse,
        key: 'id',
      },
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'Medication',
    tableName: 'medications',
    timestamps: true,
  }
);
