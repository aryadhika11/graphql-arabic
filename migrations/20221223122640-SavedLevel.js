'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.createTable("savedlevels", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID
            },
            category: {
                allowNull: false,
                require: true,
                type: Sequelize.STRING(255),
            },
            episode: {
                type: Sequelize.INTEGER(255),
                allowNull: false,
                require: true
            },
            level: {
                type: Sequelize.INTEGER(255),
                allowNull: false,
                require: true
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            isCompleted: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('savedlevels');

    }
};