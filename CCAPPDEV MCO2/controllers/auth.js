const {Router} = require('express');
const passport = require('passport');
const router = Router();

router.pos('/login', passport.authentication('local'), (req, res)=>{
  res.send(200);
});

module.exports = router
