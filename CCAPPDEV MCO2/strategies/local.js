const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const userModel = require('../models/register-model.js');
const passport = require('passport');

passport.serializeUser((user, done) =>{
  done(null, user.dlsuID);
});

passport.deserializeUser(async (username, done) =>{
  try{
    let user;
    let userID = username;

    const isNumber = !isNaN(userID);

    if (isNumber) {
        user = await userModel.findOne({ dlsuID: userID });
    } else {
        user = await userModel.findOne({ email: userID });
    }

    if(user){
      done(null, user)
    }
    else{
      done(null, false)
    }
  }
  catch(err){
    done(err, false);
  }

})

passport.use(new LocalStrategy(
  async (username, password, done) =>{
    const userID = username;

    try {
        let user;

        const isNumber = !isNaN(userID);

        if (isNumber) {
            user = await userModel.findOne({ dlsuID: userID });
        } else {
            user = await userModel.findOne({ email: userID });
        }


        // if (!user) {
        //     console.log("User not found");
        //
        //     return resp.redirect("/login?error=User not found");
        // }
        //
        //
        // if (user.isActive === false) {
        //     console.log("User is deleted");
        //
        //     return resp.redirect("/login?error=User is deleted");
        // }

        console.log("Found user");

        if (await bcrypt.compare(password, user.password)) {



            if (user.dlsuID.toString().slice(0, 3) === "101") {
                console.log("Success Lab technician");
                done(null, user, `/lt-user/${user.dlsuID}`)

            } else {
                console.log("Success");
                done(null, user, `/lt-user/${user.dlsuID}`);
            }
        } else {
            console.log("Error password");

        }
    } catch (error) {
        console.error("Error during login:", error);

        resp.redirect("/login?error=Internal server error");
    }
  }
))

// function initialize(passport, getUserByEmail, getUserByID){
//
//   const authenticateUser = async (userID, password, done)=>
//   {
//     let user = getUserByID(userID);
//
//     if (user == null){
//
//       const user2 = getUserByEmail(userID);
//
//       if(user2 == null){
//         return done(null, false, {message: 'No user with that email/ID'});
//       }
//       user = user2;
//
//     }
//
//     console.log(user.email);
//
//     try{
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user);
//       }
//       else{
//         return done(null, false, {message: 'Password incorrect'})
//       }
//     } catch(e){
//       done(e);
//     }
//
//
//
//   };
//   passport.use(new LocalStrategy({usernameField: 'userID'}, authenticateUser));
//   passport.serializeUser((user, done)=> {
//     done(null, user.id)
//   });
//   passport.deserializeUser((id, done)=> {
//     return done(null, getUserByID(id) )
//   } );
//
// }
