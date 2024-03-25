
// Functions are for pure validation checking if null in the database. Otherwise put default text
 function getUserType(userString){
  var userType;
  if(userString === "101"){
      userType = "lt-user";
  }else{ userType = "user"; }

  return userType;
}
 function getImageSource(userImage){
  var imageSource;
  if(userImage){
    imageSource = userImage
  }else{
    imageSource = "https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg";
  }

  return imageSource;
}


function getUserAbtMe(about){
  var abtMe
  if(about){
    abtMe = about;
  }else{
    abtMe = "User has yet to input a description"
  }

  return abtMe
}

function getCourse(courseGiven){
  var course;
  if(courseGiven){
    course = courseGiven;
  }else{
    course = "User has yet to input a course"
  }

  return course;
}


 function buildSearchUserQuery(username, dlsuID, firstname, lastname)
{

  const searchQuery = { };
  if (username && username.trim() !== '' && !username.includes('/')){
      searchQuery.username = username.trim();
  }
  if (dlsuID && dlsuID.trim() !== '' && !dlsuID.includes('/')){
      searchQuery.dlsuID = dlsuID.trim();
  }
  if (firstname && firstname.trim() !== '' && !firstname.includes('/')){
      searchQuery.firstname = firstname.trim();
  }
  if (lastname && lastname.trim() !== '' && !lastname.includes('/')){
      searchQuery.lastname = lastname.trim();
  }
  return searchQuery;
}

module.exports.getUserType = getUserType;
module.exports.getImageSource = getImageSource;
module.exports.buildSearchUserQuery = buildSearchUserQuery
module.exports.getUserAbtMe = getUserAbtMe;
module.exports.getCourse = getCourse;
