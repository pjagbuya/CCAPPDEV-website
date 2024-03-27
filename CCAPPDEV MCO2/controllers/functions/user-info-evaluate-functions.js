
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



function isUserTechnician(dlsuID)
{
  if(dlsuID)
  {
    if(dlsuID.toString().slice(0,3)=="101")
    {
      return true;
    }
  }
  return false


}
function getUserType(dlsuID)
{
  if(isUserTechnician(dlsuID))
  {
    return "lt-user"
  }
  return "user"


}

function getReserveJSONtoLoad(username, dlsuID, otherUserID, labRoom, imageSource, getSeatTimeRange)
{
  var dict
  if(isUserTechnician(dlsuID)){
      dict =  {
          layout: 'LT/index-LT-reserve-func',
          title: 'Tech Reserve User ' + otherUserID,
          name: username,
          techID: dlsuID,
          dlsuID: dlsuID,
          userID: otherUserID,
          imageSource: imageSource,
          labName: labRoom,
          userType: 'lt-user',
          postURL:`/lt-user/${dlsuID}/reserve/${otherUserID}/${labRoom}`,
          confirmedURL:`/lt-user/${dlsuID}/reserve`,
          helpers: {
            getSeatTimeRange: getSeatTimeRange,
          }
        }
  }
  else if(dlsuID){
    dict =  {
        layout: 'LT/index-LT-reserve-func',
        title: 'Reserving User' + dlsuID,
        name: username,
        techID: dlsuID,
        dlsuID: dlsuID,
        userID: dlsuID,
        imageSource: imageSource,
        labName: labRoom,
        userType: 'user',
        postURL:`/user/${dlsuID}/reserve/${dlsuID}/${labRoom}`,
        confirmedURL:`/user/${dlsuID}/reserve`,
        helpers: {
          getSeatTimeRange: getSeatTimeRange,
        }
      }
  }

  return dict


}




module.exports.getUserType = getUserType;
module.exports.getImageSource = getImageSource;
module.exports.buildSearchUserQuery = buildSearchUserQuery
module.exports.getUserAbtMe = getUserAbtMe;
module.exports.getCourse = getCourse;
module.exports.getReserveJSONtoLoad = getReserveJSONtoLoad;
module.exports.isUserTechnician = isUserTechnician;
module.exports.getUserType = getUserType;
