var sequelize = require('.');
let Sequelize = require("sequelize")
console.log("sequelize inited")
var User = sequelize.define('user', {
    uuid: {
        type: Sequelize.UUID,
        defaultType: Sequelize.UUIDV4,
        field: 'uuid' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    username: {
        type: Sequelize.STRING,
        field: 'username' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});
User.sync()
module.exports = User