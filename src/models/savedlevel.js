module.exports = (sequelize, DataTypes) => {
    const Savedlevel = sequelize.define('savedlevel', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID
        },
        category: {
            allowNull: false,
            require: true,
            type: DataTypes.STRING(255),
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
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        isCompleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
    }, {
        timestamps: false,
    });
    Savedlevel.associate = function(models) {
        Savedlevel.belongsTo(models.user, { foreignKey: "id" });
    };

    return Savedlevel;
};