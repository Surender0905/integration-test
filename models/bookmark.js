const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/init");

const Bookmark = sequelize.define("Bookmark", {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Bookmark;
