var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connection = mysql.createConnection({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'test'
	});
	return connection;
}

function fetchTime(callback){
	var currentdate = new Date(); 
	var datetime = "" + currentdate.getDate() + "/"
	                + (currentdate.getMonth()+1)  + "/" 
	                + currentdate.getFullYear() + " @ "  
	                + currentdate.getHours() + ":"  
	                + currentdate.getMinutes() + ":" 
	                + currentdate.getSeconds();
	console.log(datetime);
	callback(datetime);

}





function fetchData(callback,sqlQuery){
	
	
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=getConnection();
	
	connection.query(sqlQuery, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
		}
		else 
		{	// return err or result
			callback(err, result);
		}
	});
	
	
	console.log("\nConnection closed..");
	connection.end();
}


//------------------------------------------------------------------






exports.fetchTime=fetchTime;
exports.fetchData=fetchData;