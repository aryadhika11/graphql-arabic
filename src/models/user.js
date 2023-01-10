const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true
            },
            unique: true
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        exp: {
            type: DataTypes.INTEGER(255),
            defaultValue: 0,
            allowNull: true
        },
        points: {
            type: DataTypes.INTEGER(255),
            defaultValue: 0,
            allowNull: true
        },
        avatar: {
            type: DataTypes.STRING(255),
            defaultValue: "https://res.cloudinary.com/dfm7qje8a/image/upload/v1642154801/default-avatar.jpg",
            allowNull: true
        }
    }, {
        timestamps: false,
        hooks: {
            beforeCreate: async(user) => {
                if (user.password) {
                    const salt = await bcrypt.genSaltSync(10, 'a');
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            },
            beforeUpdate: async(user) => {
                if (user.password) {
                    const salt = await bcrypt.genSaltSync(10, 'a');
                    user.password = bcrypt.hashSync(user.password, salt);
                }
            }
        }
    });
    User.associate = function(models) {
        User.hasOne(models.savedlevel, { foreignKey: "id" });
    };
    User.validPassword = async(password, hash) => {
        return await bcrypt.compareSync(password, hash);
    }
    return User;
};