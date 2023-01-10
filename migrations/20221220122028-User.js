'use strict';

module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.createTable("users", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                validate: {
                    isEmail: true
                },
                unique: true
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            date: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                allowNull: false
            },
            exp: {
                type: Sequelize.INTEGER(255),
                defaultValue: 0,
                allowNull: true
            },
            points: {
                type: Sequelize.INTEGER(255),
                defaultValue: 0,
                allowNull: true
            },
            avatar: {
                type: Sequelize.STRING(255),
                defaultValue: "https://res.cloudinary.com/dfm7qje8a/image/upload/v1642154801/default-avatar.jpg",
                allowNull: false
            }
        });
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.dropTable('users');

    }
};