const path = require('path');
const sequelize = require('./util/database');

const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./models/product');
const User = require('./models/user');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// this to map models to tables
sequelize.sync({ force: true }).then(result => {
    app.listen(3000);
}).catch(err => console.log(err))

