const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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',
  }
}));

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error');
  console.log(errorMessage);
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: errorMessage,
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash('error');
  console.log(errorMessage);
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      console.log('no exisit user');
      req.flash('error', 'Invalid mail');
      return res.redirect('/login');
    }
    bcrypt.compare(password, user.password).then(doMatch => {
      console.log(doMatch);
      if (doMatch) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          res.redirect('/');
        });
      }
      req.flash('error', 'Invalid Password ');
      res.redirect('/login');
    })
  }).catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email }).then(userDoc => {
    if (userDoc) {
      req.flash('error', 'mail exisits');

      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12).then(hashedPassword => {
      console.log(hashedPassword);
      const user = User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
  }).then(result => {
    res.redirect('/login');
    return transporter.sendMail({
      from: 'abdotarekfathy@gmail.com',
      to: email,
      subject: 'Signup succeeded',
      html: '<h1> You have succeeded in signing up <h1>'
    })
  }).catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash('error');
  console.log(errorMessage);
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: errorMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        req.flash('error', 'Email does not exisit');
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      return user.save();
    }
    ).then(result => {
      res.redirect('/login');
      transporter.sendMail({
        from: 'abdotarekfathy@gmail.com',
        to: req.body.email,
        subject: 'Reset password',
        html: `
        <p> You have requested password reset </p>
        <p> click here <a href="http://localhost:3000/reset/${token}">link </a> to set a new password</p>
        `
      });
    }).catch(err => console.log(err));
  })
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token,resetTokenExpiration: { $gt: Date.now() } }).then(user => {
    let errorMessage = req.flash('error');
    console.log(errorMessage);
    if (errorMessage.length > 0) {
      errorMessage = errorMessage[0];
    } else {
      errorMessage = null;
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'Update password',
      userId: user._id.toString(),
      errorMessage: errorMessage,
      passwordToken: token
    });


  }).catch(err => console.log(err));;
}

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  }).then(user => {
    console.log(user);
    resetUser = user;
    return bcrypt.hash(newPassword, 12).then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    }).then(result =>
      res.redirect('/login')
    ).catch(err => console.log(err));;
  })
}