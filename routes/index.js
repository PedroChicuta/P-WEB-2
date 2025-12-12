var express = require('express');
var router = express.Router();

// rota principal
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

module.exports = router;
