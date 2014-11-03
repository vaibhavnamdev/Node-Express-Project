var ejs= require('ejs');
var mysql = require('mysql');
var myPool = require('./myConnectionPool');

function getConnection(){
	var connectionPool = myPool.createPool({
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
	connectionPool.getConnectionFromPool(function(index,connection) {
		
		connection.query(sqlQuery, function(err, result) {
		 
			{	// return err or result
				callback(err, result);
			}
		});
		
		connectionPool.returnConnectionToPool(index);
		console.log("\nConnection Release..");
	});
	
	

	
}



//------------------------------------------------------------------





exports.fetchTime=fetchTime;
exports.fetchData=fetchData;
