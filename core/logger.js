
function Logger(){};

var logMode = true;

Logger.prototype = {
	consoleLog: function(datetime, message){
		if(logMode){
			console.log(datetime.toLocaleString() + `.${datetime.getMilliseconds()}`, '--------------------------------');
			console.log(message);
		}
	}
}

module.exports = Logger;
