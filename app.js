'use strict';

const express = require('express');
const app = express();
const router = require('./routes/index');
const layouts = require('express-ejs-layouts');
const con = require('./db/mysql');
const methodOverride = require('method-override');
const session = require('express-session');
const helmet = require('helmet');
const connectFlash = require('connect-flash');
const expressValidator = require('express-validator');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/** mysql,DBに接続 */
con.connect((err) => {
  if (err) throw err;
  console.log('mysqlに接続できました');
});

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');

app.use(express.static('public')); // 静的ファイル供給
app.use(layouts);
app.use(express.urlencoded({ extended: false })); // body-parser同じ
app.use(helmet());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] })); // method-overrideの処理
app.use(express.json()); // body-parser同じ

app.use(session({
  secret: 'secret_passcode', /* 'keyboard cat', */ // cookieの暗号化,必須
  cookie: {
    maxAge: 4000000 // 4万mm秒(約1時間でcookie有効期限)
  },
  resave: false, // 毎回セッションを作成しない
  saveUninitialized: false // 未初期化セッションを保存しない
}));

/** 認証 */
passport.serializeUser(function (username, done) {
  done(null, username);
});
passport.deserializeUser(function (username, done) {
  done(null, { name: username });
});
passport.use(new LocalStrategy(
  function (username, password, done) {
    const selectHash = 'select employee_id, hash from staff_lists where employee_id = ?';
    con.query(selectHash, username, (err, result) => {
      if (err) throw err;
      const hash = result;
      const map1 = hash.map(value => value.employee_id.toString());
      const map2 = hash.map(value => value.hash);
      const hash2 = map2[0];
      const authenticationHash = bcrypt.compareSync(password, hash2); // hashと入力passを照合,trueかfalse
      if (map1.includes(username) && authenticationHash === true) { // username,password紐付きはinputのname
        return done(null, username);
      }
      return done(null, false, {});
    });
  }
));

/**  passport(FlashMessageの前に記述必須) */
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash()); // FlashMessageの箱
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated(); // 認証,true or false check
  res.locals.staffs = req.user;
  next();
});
app.use(expressValidator());

app.use('/', router); // load済 -> routes/index

// サーバー監視
app.listen(app.get('port'), () => {
  console.log(`port${app.get('port')}を監視しています`);
});
