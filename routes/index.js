'use strict';

const router = require('express').Router(); // ExpressとRouterをload

const managerRoutes = require('./managerRoutes');
const careRecordRoutes = require('./careRecordRoutes');
const homeRoutes = require('./homeRoutes');

router.use('/managers', managerRoutes);
router.use('/careRecords', careRecordRoutes);
router.use('/', homeRoutes);

module.exports = router; // app.jsにloadさせる(全ての経路の入り口)
