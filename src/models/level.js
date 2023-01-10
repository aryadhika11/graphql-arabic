const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const Level = sequelize.define('level', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER(255)
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        episode: {
            type: DataTypes.INTEGER(255),
            allowNull: false,
            require: true
        },
        level: {
            type: DataTypes.INTEGER(255),
            allowNull: false,
            require: true
        },
        question: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        answer1: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        answer2: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        answer3: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        answer4: {
            type: DataTypes.STRING(255),
            allowNull: false,
            require: true
        },
        correctanswer: {
            type: DataTypes.INTEGER(255),
            allowNull: false,
            require: true
        },
        sound: {
            type: DataTypes.STRING(255),
        }
    }, {
        timestamps: false,
    });
    return Level;
};