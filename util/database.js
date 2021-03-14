import Sequelize from 'sequelize';

const sequelize = new Sequelize('node-complete', 'root', 'abdo 405', { dialect: 'mysql', host: 'localhost' });

module.exports = sequelize;

