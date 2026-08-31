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
import { Clinic } from './Clinic';
import { Warehouse } from './Warehouse';
import { Medication } from './Medication';
import { User } from './User';
import { SUPPLY_REQUEST_STATUSES, SupplyRequestStatus } from './enums';

export class SupplyRequest extends Model<InferAttributes<SupplyRequest>, InferCreationAttributes<SupplyRequest>> {
  declare id: CreationOptional<number>;
  declare clinicId: ForeignKey<Clinic['id']>;
  declare medicationId: ForeignKey<Medication['id']>;
  declare warehouseId: ForeignKey<Warehouse['id']>;
  declare requestManagerId: ForeignKey<User['id']>;
  declare requestedQuantity: number;
  declare status: CreationOptional<SupplyRequestStatus>;
  declare isDeleted: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;

  declare clinic?: NonAttribute<Clinic>;
  declare medication?: NonAttribute<Medication>;
  declare warehouse?: NonAttribute<Warehouse>;
  declare requestManager?: NonAttribute<User>;
}

SupplyRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Clinic,
        key: 'id',
      },
    },
    medicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Medication,
        key: 'id',
      },
    },
    warehouseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Warehouse,
        key: 'id',
      },
    },
    requestManagerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    requestedQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    status: {
      type: DataTypes.ENUM(...SUPPLY_REQUEST_STATUSES),
      allowNull: false,
      defaultValue: 'pending',
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: 'SupplyRequest',
    tableName: 'supply_requests',
    timestamps: true,
  }
);
