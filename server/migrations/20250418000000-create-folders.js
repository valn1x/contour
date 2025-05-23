"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "folders",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          urlId: {
            type: Sequelize.STRING(10),
            allowNull: false,
            unique: true,
          },
          parentFolderId: {
            type: Sequelize.UUID,
            allowNull: true,
            onDelete: "cascade",
            references: {
              model: "folders",
              key: "id",
            },
          },
          collectionId: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: {
              model: "collections",
              key: "id",
            },
          },
          teamId: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: {
              model: "teams",
              key: "id",
            },
          },
          createdById: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: {
              model: "users",
              key: "id",
            },
          },
          updatedById: {
            type: Sequelize.UUID,
            allowNull: false,
            onDelete: "cascade",
            references: {
              model: "users",
              key: "id",
            },
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction }
      );

      await queryInterface.addIndex("folders", ["collectionId"], { transaction });
      await queryInterface.addIndex("folders", ["parentFolderId"], { transaction });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("folders", { transaction });
    });
  },
};
