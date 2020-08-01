'use strict';

const router = require('express').Router();
const careRecordController = require('../controllers/careRecordController');

router.get('/new', careRecordController.new);
router.post('/create', careRecordController.validate, careRecordController.newUserConfirmation, careRecordController.create);
router.get('/usersList', careRecordController.usersList);
router.get('/users/:user_id', careRecordController.usersGet);
router.get('/updatePage/:user_id', careRecordController.updatePage);
router.put('/update/:user_id/update', careRecordController.update);
router.get('/recordPage/:user_id', careRecordController.recordPage);
router.post('/recordCreate/:user_id', careRecordController.recordValidate, careRecordController.newRecordConfirmation, careRecordController.recordCreate);
router.get('/searchPage/:user_id', careRecordController.searchPage);
router.get('/recordSearch/:user_id', careRecordController.search);

module.exports = router; // routes/index.jsにloadさせる
