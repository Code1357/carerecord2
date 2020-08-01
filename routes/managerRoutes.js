'use strict';

const router = require('express').Router();
const managerController = require('../controllers/managerController');
const staffController = require('../controllers/staffController');

// リクエストをパスを受付、処理実行を記述
router.get('/login', managerController.login);
router.post('/login',　managerController.validate, managerController.authenticate);
router.get('/logout', managerController.logout);
router.get('/info', managerController.info);
router.get('/new', staffController.new);
router.post('/create1', staffController.validate, staffController.newConfirmation, staffController.create);
router.post('/create2', staffController.validate, staffController.newConfirmation2, staffController.create);
router.get('/staffsList', staffController.staffsList);
router.get('/staffs/:staff_id', staffController.staffsGet);
router.get('/updatePage/:staff_id', staffController.updatePage);
router.put('/update/:staff_id/update', staffController.update);

module.exports = router; // routes/index.jsにloadさせる
