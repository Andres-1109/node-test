import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { sequelize } from '../config/sequelize';
import type { Medication } from './Medication';
import type { SupplyRequest } from './SupplyRequest';

export class Warehouse extends Model<InferAttributes<Warehouse>, InferCreationAttributes<Warehouse>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare location: string;
  declare isActive: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare medications?: NonAttribute<Medication[]>;
  declare supplyRequests?: NonAttribute<SupplyRequest[]>;
}

Warehouse.init(
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
    location: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
  }
);
