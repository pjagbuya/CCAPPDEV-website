const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('./models/register-model.js');
const passport = require('passport');



async function initialize(passport, getUserByEmail, getUserByID){

  const authenticateUser =   async (userID, password, done)=>
  {

    let user =  getUserByID(userID);

    if (user == null){

      const user2 =  getUserByEmail(userID);

      if(user2 == null){
        return done(null, false, {message: 'No user with that email/ID'});
        console.log("'No user with that email/ID'")
      }
      user = user2;

    }

    console.log(user.email);

    try{
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
        console.log("Login Success")
      }
      else{
        return done(null, false, {message: 'Password incorrect'})
        console.log("Password incorrect")
      }
    } catch(e){
      console.log("Error decrypting")
      done(e);
    }



  };
  passport.use(new LocalStrategy({usernameField: 'userID'}, authenticateUser));
  passport.serializeUser((user, done)=> {
    done(null, user.id)
  });
  passport.deserializeUser((id, done)=> {
    return done(null, getUserByID(id) )
  } );

}

module.exports =initialize
