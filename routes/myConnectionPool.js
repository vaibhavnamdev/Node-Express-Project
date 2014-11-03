var ejs= require('ejs');
var mysql = require('mysql');
var connectionPool;
var pool=[];
var poolflag=[]
var poolSize;
var details;

connectionPool={
		pool : pool,
		getConnectionFromPool : getConnectionFromPool,
		returnConnectionToPool : returnConnectionToPool
}
//return connection to Pool...
var returnConnectionToPool= function(index)
{
	 poolflag[index]=0;
//Adding the connection from the client back to the connection pool
	 
}


var getConnectionFromPool= function(callback)
{
var connection;
var connectionFound=0;
var index;
var err="ERROR";
//Check if there is a connection available. There are times when all the connections in the pool may be used up
for(var i=0;i<poolSize;i++){
		if(poolflag[i]==0){
			index=i;
			connection=pool[i];
			connectionFound=1;
			poolflag[i]=1;
			console.log("connection found");
			break;
			}
		}
if(connectionFound==0)
	 {
	 console.log("Connection not found");
	 }
//Giving away the connection from the connection pool
callback(index,connection);
}

connectionPool={
		pool : pool,
		getConnectionFromPool : getConnectionFromPool,
		returnConnectionToPool : returnConnectionToPool
}

function createPool(databaseDetails){

	details={
			  host     : databaseDetails.host,
			  user     : databaseDetails.user,
			  password : databaseDetails.password,
			  database	: databaseDetails.database
			}
	
	poolSize=databaseDetails.connectionLimit;
	pool.length = poolSize;
	poolflag.length = poolSize;
	for(var i=0;i<poolSize;i++){
		poolflag[i] = 0;
		}
	createConnectionPool(poolSize);
	return connectionPool;
}


function createConnectionPool(poolSize){
	for(var i=0;i<poolSize;i++){
	pool[i] = mysql.createConnection(details);
	}
}


exports.createPool=createPool;

 