
function getData(){
    const fs = require('fs');
	let rawdata = fs.readFileSync('fakeData.json');
	return JSON.parse(rawdata);
}

module.exports.getData = getData;
