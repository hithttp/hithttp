var sequelize = require('.');
let Sequelize = require("sequelize")
var UserApi = sequelize.define('userapi', {
    path:{
        type:Sequelize.STRING
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
UserApi.sync()
module.exports = UserApi