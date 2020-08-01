'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const passport = require('passport');
const loginSQL = require('../models/login');

module.exports = {

  validate: (req, res, next) => {
    req.check('username')
      .not().isEmpty().withMessage('社員番号が抜けています');
    req.check('username')
      .isInt().withMessage('社員番号は半角数字で入力してください')
      .isLength({
        min: 6,
        max: 6
      }).withMessage('社員番号は6文字で入力してください');
    req.check('password')
      .not().isEmpty().withMessage('パスワードが抜けています')
      .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i).withMessage('パスワードは、半角英字を1文字以上、数字を1つ以上含む、8~15文字の間で入力してください');
    req.getValidationResult().then(error => {
      if (!error.isEmpty()) {
        const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
        req.flash('error', messages);
        res.redirect('/managers/login');
      } else {
        next();
      }
    });
  },

  login: (req, res) => {
    res.render('managers/login');
  },

  authenticate: passport.authenticate('local',
    {
      successRedirect: '/managers/info',
      successFlash: 'ログインに成功しました。',
      failureRedirect: '/managers/login',
      failureFlash: 'ログイン失敗。社員番号,パスワードを確認してください。'
    }),

  info: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const username = req.user.name;
      con.query(loginSQL.login, username, (err, result) => {
        if (err) throw err;
        const position = result[0].position_lists_position_id;
        if (position === 1) {
          res.render('managers/info', { position1: 1 });
        } else {
          res.render('careRecords/info', { position2: 2, position3: 3 });
        }
      });
    }
  },

  logout: (req, res, next) => {
    req.logout(); // passportのメソッド
    req.flash('success', 'ログアウトしました。');
    res.redirect('/');
    next();
  }

};
