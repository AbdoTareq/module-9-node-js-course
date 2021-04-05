const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongodbStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://nodejs:NREf9kfDnzVxaPX@cluster0.cw0mt.mongodb.net/shop';

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();
const store = MongodbStore({ uri: MONGODB_URI, collection: 'sessions' });

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'this secret text must be long in production code', resave: false, saveUninitialized: false,
    store: store
}));

// app.use((req, res, next) => {
//     User.findById('60688fa2849277694e2c7748').then(user => {
//         req.user = user;
//         next();
//     }).catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({ name: 'Abdo', email: 'abdotarek@gmail.com', cart: { items: [] } });
                user.save();
            }
        })
        app.listen(3000);
    }).catch(err => console.log(err));


