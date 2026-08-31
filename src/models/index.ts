import { sequelize } from '../config/sequelize';
import { User } from './User';
import { Clinic } from './Clinic';
import { Warehouse } from './Warehouse';
import { Medication } from './Medication';
import { SupplyRequest } from './SupplyRequest';

Warehouse.hasMany(Medication, { foreignKey: 'warehouseId', as: 'medications' });
Medication.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

Clinic.hasMany(SupplyRequest, { foreignKey: 'clinicId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Clinic, { foreignKey: 'clinicId', as: 'clinic' });

Warehouse.hasMany(SupplyRequest, { foreignKey: 'warehouseId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Warehouse, { foreignKey: 'warehouseId', as: 'warehouse' });

Medication.hasMany(SupplyRequest, { foreignKey: 'medicationId', as: 'supplyRequests' });
SupplyRequest.belongsTo(Medication, { foreignKey: 'medicationId', as: 'medication' });

User.hasMany(SupplyRequest, { foreignKey: 'requestManagerId', as: 'supplyRequests' });
SupplyRequest.belongsTo(User, { foreignKey: 'requestManagerId', as: 'requestManager' });

export { sequelize, User, Clinic, Warehouse, Medication, SupplyRequest };
