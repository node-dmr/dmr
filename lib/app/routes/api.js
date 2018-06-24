var express = require('express');
var router = express.Router();

/* GET users listing. */
router.use('/report', require('./api/report'));
router.get('/', function(req, res, next) {
  res.send('api');
});

module.exports = router;
