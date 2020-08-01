'use strict';

const con = require('../db/mysql');
const httpStatus = require('http-status-codes');
const careRecordSQL = require('../models/careRecord');

module.exports = {

  new: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newUserConfirmation = newUserConfirmation;
      res.render('careRecords/new');
    }
  },

  validate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      req.check('entrance_data')
        .not().isEmpty().withMessage('入所日は、必ず入力してください');
      req.check('user_name')
        .not().isEmpty().withMessage('利用者名は、必ず入力してください');
      req.check('genders_gender_id', '性別は1~2の半角数字で入力してください')
        .isInt()
        .isLength({
          min: 1,
          max: 1
        });
      req.check('adls_adl_id', 'ADLは1~3の半角数字で入力してください')
        .isInt()
        .isLength({
          min: 1,
          max: 1
        });
      req.getValidationResult().then(error => {
        if (!error.isEmpty()) {
          const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
          req.flash('error', messages);
          res.redirect('/careRecords/new');
        } else {
          next();
        }
      });
    }
  },

  newUserConfirmation: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      if (req.body.action2) {
        delete req.body.action2;
        const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newUserConfirmation = newUserConfirmation;
        res.render('careRecords/new');
      } else {
        delete req.body.action;
        const newUserConfirmation = JSON.parse(JSON.stringify(req.body));
        res.locals.newUserConfirmation = newUserConfirmation;
        next();
      };
    }
  },

  create: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(careRecordSQL.insertUserInfo, req.body, (error, results) => {
        if (error) {
          req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
          res.redirect('/careRecords/new');
        } else {
          res.render('careRecords/newUserConfirmation');
        }
      });
    }
  },

  updatePage: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const userId = req.params.user_id;
      con.query(careRecordSQL.selectUserInfo, userId, (err, result) => {
        if (err) throw err;
        res.locals.userId = userId;
        const userUpdate = result;
        res.locals.userUpdate = userUpdate;
        const resultEntranceData = result[0].entrance_data;
        const entranceData = `${resultEntranceData.getUTCFullYear()}/${resultEntranceData.getUTCMonth() + 1}/${resultEntranceData.getUTCDate()}`;
        res.locals.entranceData = entranceData;
        res.render('careRecords/update');
      });
    }
  },

  usersList: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(careRecordSQL.orderByName, (err, result) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;
        res.render('careRecords/usersList');
      });
    }
  },

  update: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const userId = req.params.user_id;
      const name = req.body.user_name;
      const adl = req.body.adls_adl_id;
      con.query(careRecordSQL.updateUserInfo, [name, adl, userId], function (err, result) {
        if (err) throw err;
      });
      con.query(careRecordSQL.selectUserInfo, userId, function (err, result) {
        if (err) throw err;
        const resultEntranceData = result[0].entrance_data;
        const entranceData = `${resultEntranceData.getUTCFullYear()}年${resultEntranceData.getUTCMonth() + 1}月${resultEntranceData.getUTCDate()}日`;
        res.locals.entranceData = entranceData;
        if (req.body.action2) {
          delete req.body.action2;
          res.redirect(`/careRecords/updatePage/${userId}`);
        } else {
          res.render('careRecords/updateComplete', { updateDate: result });
        };
      });
    }
  },

  usersGet: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(careRecordSQL.orderByName, (err, result) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query(careRecordSQL.selectUserName, userId, (err, result) => {
            if (err) throw err;
            res.locals.userName = result[0].user_name;
            con.query(careRecordSQL.selectEntranceDate, userId, (err, result) => {
              if (err) throw err;
              const resultEntranceData = result[0].entrance_data;
              const entranceData = `${resultEntranceData.getUTCFullYear()}年${resultEntranceData.getUTCMonth() + 1}月${resultEntranceData.getUTCDate()}日`;
              res.locals.entranceData = entranceData;
              con.query(careRecordSQL.selectAdlJoin, userId, (err, result) => {
                if (err) throw err;
                const adl = result[0].adl;
                res.locals.adl = adl;
                con.query(careRecordSQL.selectGenderJoin, userId, (err, result) => {
                  if (err) throw err;
                  const gender = result[0].gender;
                  res.locals.gender = gender;
                  res.render('careRecords/userInfo');
                });
              });
            });
          });
        }
      });
    }
  },

  recordPage: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const newRecUserConfirmation = JSON.parse(JSON.stringify(req.body));
      res.locals.newRecUserConfirmation = newRecUserConfirmation;
      con.query(careRecordSQL.orderByName, (err, result) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query(careRecordSQL.selectUserName, userId, (err, result) => {
            if (err) throw err;
            res.locals.userName = result[0].user_name;
            con.query(careRecordSQL.selectAdlJoin, userId, (err, result) => {
              if (err) throw err;
              const adl = result[0].adl;
              res.locals.adl = adl;
              con.query(careRecordSQL.selectGenderJoin, userId, (err, result) => {
                if (err) throw err;
                const gender = result[0].gender;
                res.locals.gender = gender;
                res.render('careRecords/userRecord');
              });
            });
          });
        }
      });
    }
  },

  newRecordConfirmation: (req, res, next) => {
    if (req.body.action2) {
      delete req.body.action2;
    } else {
      delete req.body.action;
      next();
    };
  },

  recordValidate: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const userId = req.params.user_id;
      req.check('record_date')
        .isBefore().withMessage('未来の日時は入力できません')
        .not().isEmpty().withMessage('記録虹時は必ず入力してください');
      req.check('record_data')
        .not().isEmpty().withMessage('記録は必ず記入してから登録してください');
      req.getValidationResult().then(error => {
        if (!error.isEmpty()) {
          const messages = error.array().map(e => e.msg); // error配列オブジェクトを配列に吐き出す
          req.flash('error', messages);
          res.redirect(`/careRecords/recordPage/${userId}`);
        } else {
          next();
        }
      });
    }
  },

  recordCreate: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      const recordDate = req.body.record_date; // 記録日時
      const record = req.body.record_data; // 記録内容
      const staffId = req.user.name; // スタッフID
      const userId = req.params.user_id; // 利用者のID
      // スタッフ名を検索
      con.query(careRecordSQL.selectStaffName, staffId, (err, result) => {
        if (err) throw err;
        const staffName = result[0].staff_name;
        con.query(careRecordSQL.careRecord, [recordDate, record, userId, staffId, staffName], (error, results) => {
          if (error) {
            req.flash('error', '登録できませんでした,もう一度登録しなおしてください');
            res.redirect(`/careRecords/recordPage/${userId}`);
          } else {
            req.flash('success', '記録の登録完了');
            res.redirect(`/careRecords/users/${userId}`);
          }
        });
      });
    }
  },

  searchPage: (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(careRecordSQL.orderByName, (err, result) => {
        if (err) throw err;
        res.locals.userList = result;
        {
          const userId = req.params.user_id;
          res.locals.userId = userId;
          con.query(careRecordSQL.selectUserName, userId, (err, result) => {
            if (err) throw err;
            res.locals.userName = result[0].user_name;
            con.query(careRecordSQL.selectAdlJoin, userId, (err, result) => {
              if (err) throw err;
              const adl = result[0].adl;
              res.locals.adl = adl;
              con.query(careRecordSQL.selectGenderJoin, userId, (err, result) => {
                if (err) throw err;
                const gender = result[0].gender;
                res.locals.gender = gender;
                res.render('careRecords/recordSearch');
              });
            });
          });
        }
      });
    }
  },

  search: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('success', 'ログインセッションが切れ');
      res.status(httpStatus.NO_CONTENT);
      res.redirect('/managers/login');
    } else {
      con.query(careRecordSQL.orderByName, (err, result) => {
        if (err) throw err;
        const userList = result;
        res.locals.userList = userList;
        const userId = req.params.user_id;
        res.locals.userId = userId;
        con.query(careRecordSQL.selectUserName, userId, (err, result) => {
          if (err) throw err;
          res.locals.userName = result[0].user_name;
          con.query(careRecordSQL.selectAdlJoin, userId, (err, result) => {
            if (err) throw err;
            const adl = result[0].adl;
            res.locals.adl = adl;
            con.query(careRecordSQL.selectGenderJoin, userId, (err, result) => {
              if (err) throw err;
              const gender = result[0].gender;
              res.locals.gender = gender;
              // レコーディングテーブルから検索
              const searchDate = req.query.search_date;
              con.query(careRecordSQL.careRecordSearch, [searchDate, userId], (err, result) => {
                if (err) throw err;
                const pastRecord = result;
                res.locals.pastRecord = pastRecord;
                res.render('careRecords/pastRecord');
              });
            });
          });
        });
      });
    }
  }

};
