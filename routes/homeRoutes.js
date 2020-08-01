'user strict';

const router = require('express').Router();
const homeController = require('../controllers/homeController');

// リクエストをパスを受付、処理実行を記述
router.get('/', homeController.offTop, homeController.index);

module.exports = router; // routes/index.jsにloadさせる
