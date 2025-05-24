"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("folders", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      collectionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "collections",
        },
      },
      parentFolderId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "folders",
        },
      },
      createdById: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
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
    });

    await queryInterface.addIndex("folders", ["collectionId"]);
    await queryInterface.addIndex("folders", ["parentFolderId"]);

    await queryInterface.addColumn("documents", "folderId", {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "folders",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("documents", "folderId");
    await queryInterface.dropTable("folders");
  },
};
