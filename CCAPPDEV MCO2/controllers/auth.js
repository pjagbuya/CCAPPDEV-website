const { Router } = require('express');
const passport = require('passport');

const router = Router();

try {
  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(200)
  });
} catch (e) {
  console.error("Error Found ", e)
} finally {

}


module.exports = router
