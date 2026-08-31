'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('supply_requests', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clinicId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clinics',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      medicationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'medications',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      warehouseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'warehouses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      requestManagerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      requestedQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('supply_requests');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_supply_requests_status";');
  },
};
