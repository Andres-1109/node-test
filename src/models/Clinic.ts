import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize';

export class Clinic extends Model<InferAttributes<Clinic>, InferCreationAttributes<Clinic>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare taxId: string;
  declare managerName: string;
  declare isActive: CreationOptional<boolean>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Clinic.init(
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
    taxId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    managerName: {
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
    modelName: 'Clinic',
    tableName: 'clinics',
    timestamps: true,
  }
);
