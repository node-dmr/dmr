let express = require('express');
let router = express.Router();
let ReportCrontroller = require('../../controllers/report/report');
let controller = new ReportCrontroller();

router.get('/', function(req, res, next) {
    res.send('base report');
});
router.get('/*', function(req, res, next) {
  if (req.params) {
    controller.get(req, res, next);
  } else {
    res.end();
  }
  console.log(req.param);
});

module.exports = router;