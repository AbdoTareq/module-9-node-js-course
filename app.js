const path = require('path');
const sequelize = require('./util/database');

const express = require('express');
const bodyParser = require('body-parser');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { use } = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Tables relations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

// many to many needs seperate table which in this case CartItem
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);
Product.belongsToMany(Order, { through: OrderItem });

// this to map models to tables
sequelize
    // .sync()
    .sync({ force: true })
    .then(result => User.findByPk(1)).then(user => {
        if (!user) {
            const temp = { name: 'Abdo', email: 'abc@mail.com' };
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', temp);
            return User.create(temp);
        }
        return user;
    }
    ).then(user => user.createCart())
    .then(cart => app.listen(3000))
    .catch(err => console.log(err))

