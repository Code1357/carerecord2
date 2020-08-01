'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const staffSQL = require('../models/staff');

module.exports = {

  new: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      res.render('managers/new');
    }
  },

  validate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      req.check('employee_id')
        .isLength(
          {
            min: 6,
            max: 6
          }).withMessage('社員番号は6文字で入力してください')
        .not().isEmpty().withMessage('社員番号は、必ず入力してください');
      req.check('hire_data')
        .not().isEmpty().withMessage('入社日は、必ず入力してください');
      req.check('staff_name')
        .not().isEmpty().withMessage('社員名は、必ず入力してください');
      req.check('hash')
        .matches(/^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,15}$/i).withMessage('パスワードは、半角英字を1文字以上、数字を1つ以上含む、8~15文字の間で作成してください')
        .not().isEmpty().withMessage('パスワードは、必ず入力してください');
      req.check('birthday')
        .isBefore().withMessage('未来の誕生日は入力できません')
        .not().isEmpty().withMessage('誕生日は、必ず入力してください');
      req.check('genders_gender_id', '性別は1か2の半角数字で入力してください')
        .isInt()
        .isLength({
          min: 1,
          max: 1
        });
      req.check('position_lists_position_id', '役職は1〜3の半角数字で入力してください')
        .isInt()
        .isLength({
          min: 1,
          max: 1
        });
      req.getValidationResult().then(error => {
        if (!error.isEmpty()) {
          const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
          req.flash('error', messages);
          res.redirect('/managers/new');
        } else {
          next();
        }
      });
    }
  },

  newConfirmation: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      if (req.body.action2) {
        delete req.body.action2;
        const newConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newConfirmation = newConfirmation;
        res.render('managers/new');
      } else if (!req.body.action) {
        delete req.body.action;
        const newConfirmation = JSON.parse(JSON.stringify(req.body));
        res.render('managers/new2', { newConfirmation: newConfirmation });
      } else {
        delete req.body.action;
        const newConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newConfirmation = newConfirmation;
        next();
      };
    }
  },

  newConfirmation2: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newConfirmation = newConfirmation;
      next();
    }
  },

  create: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const pass = req.body.hash;
      const hash = bcrypt.hashSync(pass, saltRounds);
      req.body.hash = hash;
      con.query(staffSQL.info, req.body, (error, results) => {
        if (error) {
          req.flash('error', '登録できませんでした,既に登録されている社員IDです');
          res.redirect('/managers/new');
        } else {
          res.render('managers/newConfirmation');
        }
      });
    }
  },

  updatePage: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const staffId = req.params.staff_id;
      con.query(staffSQL.selectInfo, staffId, (err, result) => {
        if (err) throw err;
        res.locals.staffId = staffId;
        const staffUpdate = result;
        res.locals.staffUpdate = staffUpdate;
        const resultHireData = result[0].hire_data;
        const hireData = `${resultHireData.getUTCFullYear()}/${resultHireData.getUTCMonth() + 1}/${resultHireData.getUTCDate()}`;
        res.locals.hireData = hireData;
        const birthdayData = result[0].birthday;
        const birthday = `${birthdayData.getUTCFullYear()}/${birthdayData.getUTCMonth() + 1}/${birthdayData.getUTCDate()}`;
        res.locals.birthday = birthday;
        res.render('managers/update');
      });
    }
  },

  update: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const staffId = req.params.staff_id;
      const name = req.body.staff_name;
      const position = req.body.position_lists_position_id;
      con.query(staffSQL.updateName, [name, position, staffId], function (err, result) {
        if (err) throw err;
      });
      con.query(staffSQL.selectInfo, staffId, function (err, result) {
        if (err) throw err;
        const resultHireData = result[0].hire_data;
        const hireData = `${resultHireData.getUTCFullYear()}年${resultHireData.getUTCMonth() + 1}月${resultHireData.getUTCDate()}日`;
        res.locals.hireData = hireData;
        const birthdayData = result[0].birthday;
        const birthday = `${birthdayData.getUTCFullYear()}年${birthdayData.getUTCMonth() + 1}月${birthdayData.getUTCDate()}日`;
        res.locals.birthday = birthday;
        if (req.body.action2) {
          delete req.body.action2;
          res.redirect(`/managers/updatePage/${staffId}`);
        } else {
          res.render('managers/updateComplete', { updateDate: result });
        };
      });
    }
  },

  staffsList: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
      next();
    } else {
      con.query(staffSQL.orderByName, (err, result) => {
        if (err) throw err;
        const staffList = result;
        res.locals.staffList = staffList;
        res.render('managers/staffsList');
      }
      );
    }
  },

  staffsGet: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(staffSQL.orderByName, (err, result) => {
        if (err) throw err;
        const staffList = result;
        res.locals.staffList = staffList;
        {
          const staffId = req.params.staff_id;
          con.query(staffSQL.selectEmployeeId, staffId, (err, result) => {
            if (err) throw err;
            const staffEmployeeId = result;
            res.locals.staffEmployeeId = staffEmployeeId[0].employee_id;
            res.locals.staffId = staffId;
            con.query(staffSQL.selectName, staffId, (err, result) => {
              if (err) throw err;
              const staffName = result;
              res.locals.staffName = staffName[0].staff_name;
              con.query(staffSQL.selectHireDate, staffId, (err, result) => {
                if (err) throw err;
                const resultHireData = result[0].hire_data;
                const hireData = `${resultHireData.getUTCFullYear()}年${resultHireData.getUTCMonth() + 1}月${resultHireData.getUTCDate()}日`;
                res.locals.hireData = hireData;

                con.query(staffSQL.selectBirthday, staffId, (err, result) => {
                  if (err) throw err;
                  const birthdayData = result[0].birthday;
                  const birthday = `${birthdayData.getUTCFullYear()}年${birthdayData.getUTCMonth() + 1}月${birthdayData.getUTCDate()}日`;
                  res.locals.birthday = birthday;

                  con.query(staffSQL.selectJoinPosition, staffId, (err, result) => {
                    if (err) throw err;
                    const position = result[0].position;
                    res.locals.position = position;

                    con.query(staffSQL.selectJoinGender, staffId, (err, result) => {
                      if (err) throw err;
                      const gender = result[0].gender;
                      res.locals.gender = gender;
                      res.render('managers/staffInfo');
                    });
                  });
                });
              });
            });
          });
        }
      });
    }
  }

};
