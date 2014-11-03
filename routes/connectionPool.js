var ejs= require('ejs');
var mysql = require('mysql');

function getConnection(){
	var connectionPool = mysql.createPool({
	    host     : 'localhost',
	    user     : 'root',
	    password : 'root',
	    database : 'test',
	    connectionLimit : 100
	});
	return connectionPool;
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



var connectionPool=getConnection();

function fetchData(callback,sqlQuery){
	
	
	
	console.log("\nSQL Query::"+sqlQuery);
	
	
	
	connectionPool.getConnection(function(err, connection) {
		
		connection.query(sqlQuery, function(err, result) {
			if(err){
				console.log("ERROR: " + err.message);
			}
			else 
			{	// return err or result
				callback(err, result);
			}
		});
		
		connection.release();
		console.log("\nConnection Release..");
	});
	
	

	
}



//------------------------------------------------------------------





exports.fetchTime=fetchTime;
exports.fetchData=fetchData;
