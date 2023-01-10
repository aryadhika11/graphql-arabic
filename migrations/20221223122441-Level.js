'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.createTable("levels", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            category: {
                type: DataTypes.STRING(255),
                allowNull: false,
                require: true
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
            question: {
                type: Sequelize.STRING(255),
                allowNull: false,
                require: true
            },
            answer1: {
                type: Sequelize.STRING(255),
                allowNull: false,
                require: true
            },
            answer2: {
                type: Sequelize.STRING(255),
                allowNull: false,
                require: true
            },
            answer3: {
                type: Sequelize.STRING(255),
                allowNull: false,
                require: true
            },
            answer4: {
                type: Sequelize.STRING(255),
                allowNull: false,
                require: true
            },
            correctanswer: {
                type: Sequelize.INTEGER(255),
                allowNull: false,
                require: true
            },
            sound: {
                type: Sequelize.STRING(255),
            }
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('levels');

    }
};