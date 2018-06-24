var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/ranges', function(req, res, next) {
  res.send('ranges');
});
router.get('/', function(req, res, next) {
    res.send('base report');
});

module.exports = router;