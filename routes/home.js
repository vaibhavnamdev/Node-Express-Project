var ejs = require("ejs");
//var mysql = require('./mysql');   // Uncomment it for using app without connection pool
var mysql = require ('./connectionPool'); // uncomment it for using app with generic connection pool
//var mysql = require ('./connection-Pool'); //uncomment it for using app with self made connection pool
var posts = "you have removed";

function start(req,res) {
	var authenticate = req.cookies.session;
	console.log("Your Session cookie is: "+authenticate);
	var data;
	var page;
	
	if(authenticate===undefined)
		{
		page= "./views/start.ejs";
		data="";
		var user = [""+data+"",""+time+""];
		ejs.renderFile(page,{user: user},function(err, result) {
			   // render on success
			   if (!err) {
			            res.end(result);
			   }
			   // render or error
			   else {
			            res.end('An error occurred');
			            console.log(err);
			   }
		   });
		}
	else{
		var suggestionValue = req.cookies.suggs;
		var allhighlight = req.cookies.Allhighlight;
		var youhighlight = req.cookies.yourhighlight;
		var arr = authenticate.split(",");
		for (var i=0; i < (arr.length-1); i++){
		    console.log(arr[i] + " / ");
		    data = arr[i];
		}
		var emailId=arr['0'];
		var passId=arr['1'];
		var time = arr['3'];
		arr = arr.map(function (val) { return +val + 1; });
		console.log(time);
		page = "./views/profile.ejs";
	
	
		
	var posts;
	var totalreviews ="";
	var categoryType = req.cookies.category;
	var review;
	if(categoryType==="All")
		{
		review = "select * from `test`.`reviews` order by ReviewId DESC;";
		}
	else if(categoryType==="Your"){
		review = "select * from `test`.`reviews` WHERE `email` ='"+emailId+"' AND `password` ='"+passId+"' ORDER BY ReviewId DESC;";
	}
	else{
		review ="select * from `test`.`reviews` WHERE category ='"+categoryType+"' ORDER BY ReviewId DESC ;";
	}
	
	var user =  [""+data+"" ,""+ time+""];

	
	mysql.fetchData(function(err,result){
		
		if(err){	
			throw err;
		
		}
		
		else 
		{
			var fetchcategory = "SELECT * FROM test.categories;";
			mysql.fetchData(function(err,categories)
					{
				if(err){throw err;}
				else{
			var emailreq = authenticate.split(",");
			var email=emailreq['0'];
			console.log(email);

			var querysugg = "select * from test.elements where Category = '"+suggestionValue+"' order by ReviewsTotal;";
			mysql.fetchData(function(err,suggest){
			if(err){throw err;}
			
			else{
			ejs.renderFile(page,{user: user, review: result, category: categories, email:email, suggestion: suggest, suggest: suggestionValue, allhigh: allhighlight, yourhigh: youhighlight },function(err, result) {
				   // render on success
				   if (!err) {
				            res.end(result);
				   }
				   // render or error
				   else {
				            res.end('An error occurred');
				            console.log(err);
				   }
			   });		
			}	
			},querysugg);
				}
					},fetchcategory);
					
					}
	
		
			},review);
	
		
	}

	

}


function signup(req,res){
	var check = req.cookies.session;
	if(check=== undefined){
	ejs.renderFile('./views/signup.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });	
}
	else{
		res.send("<script>{ if(!alert('You are Already logged in!!'))document.location='/start';}</script>You are Already logged in..!! Click to <a href='/start'>Go HOME</a>!.");
	}
}

function login(req,res){
	
	
	var authenticate = req.cookies.session;
	console.log("Your Session cookie is: "+authenticate);
	var data;
	var page;
	if(authenticate===undefined)
		{
		page= "./views/login.ejs";
		data="";
		}
	else{
		var arr = authenticate.split(",");
		for (var i=0; i < (arr.length-1); i++){
		    console.log(arr[i] + " / ");
		    data = arr[i];
		}
		var time=arr['3'];
		res.send("<script>{ if(!alert('You are Already logged in!!'))document.location='/';}</script>You are Already logged in..!! Click to <a href='/'>Go HOME</a>!.");
		
	
	}
	


	ejs.renderFile(page,function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });	
}



function afterSignIn(req,res)
{
	// check user already exists
	var dateTime="";

	mysql.fetchTime(function(time){
		dateTime="Last Login: "+time;
			});
	
	var name = req.param("first_name")+" "+req.param("last_name");
	var insertuser = "INSERT INTO `test`.`users` (`Firstname`,`Lastname`,`emailid`,`password`,`lastLogin`) VALUES ('"+req.param("first_name")+"','"+req.param("last_name")+"','"+req.param("email")+"','"+req.param("password")+"','"+dateTime+"')";
	console.log("Query is:"+insertuser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			
			if(results.length > 0){
				res.cookie("session",req.param("email")+","+req.param("password")+","+name+",First Time User",{});
				res.cookie("suggs","Restaurants");
				res.cookie("category","All");
				res.cookie("Allhighlight","selected");
				res.cookie("yourhighlight","no");
				console.log('cookie have created successfully');
				res.send("<script>{ if(!alert('Successful Signup Done!\nClick OK to GET Started'))document.location='/login';}</script>You are Successfully Signed in..!! Click to <a href='/login'>Go HOME</a>!.");
		
			}
			else {    
				
				console.log("Invalid Login");
				res.send("<script>{ if(!alert('Invalid Login!\nClick to Try Again'))document.location='/login';}</script>Invalid Login!\nClick to Try Again..!! Click to <a href='/login'>Go HOME</a>!.");
			}
		}  
	},insertuser);
}

function loginrequest(req,res)
{
	// check user already exists
	
	var authenticate = req.cookies.session;
	console.log("Your Session cookie is: "+authenticate);
	var email;
	var password;
	if(authenticate===undefined)
		{
		//res.send("<script>{ if(!alert('You are not logged in!!')) document.location = '/';}</script>You are not logged in..!! Click to <a href='/'>Go HOME</a>!.");
		}
	else{
		var arr = authenticate.split(",");    
		email = arr['0'];
		password = arr['1'];
		
		
	}
	
	email = req.param("email");
	password = req.param("password");
	var dateTime="";

	mysql.fetchTime(function(time){
		dateTime="Last Login: "+time;
			});
	
	
	
	var categoryList=new Array();
	var requestList= "select * from test.categories";
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			for(var i=0;i<results.length;i++){
				categoryList[i] = results[i].categoryName;
				//console.log(categoryList[i]);
			
			}
			
			
			
		}
	},requestList);
	
	
	
	
	
	var fetchuser = "select * from test.users where emailid ='"+email+"' && password ='"+password+"'";
	var updateTime= "update test.users SET lastLogin = '"+dateTime+"' where emailid ='"+email+"' && password ='"+password+"'";
	console.log("Query is:"+fetchuser);

	mysql.fetchData(function(err,result){
		if(err){
			
			throw err;
		}
		else 
		{
			if(result.length > 0){
				var name= result[0].Firstname+" "+result[0].Lastname;
				var lastlogin= result[0].lastLogin;
				console.log(name);
				console.log("valid Login");
				res.cookie("session",email+","+password+","+name+","+lastlogin,{});
				res.cookie("suggs","Restaurants");
				res.cookie("category","All");
				res.cookie("Allhighlight","selected");
				res.cookie("yourhighlight","no");
				console.log('cookie have created successfully');
				
					mysql.fetchData(function(err,results){
						if(err){
							
							throw err;
						}
						else 
						{
							
							res.send("<script>{ if(!alert('Congrates!!\nYou Logged in Successfully')) document.location = '/';}</script>Logged in!! Click to <a href='/'>Go HOME</a>!.");
							
							
						}
					},updateTime);
		
				
			}
			else {    
				
				console.log("Invalid Login");
				ejs.renderFile('./views/login.ejs',function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}  
	},fetchuser);
}


function logout(req,res){
	
	var authenticate = req.cookies.session;
	var arr = authenticate.split(",");
	var email= arr['0'];
	var password = arr['1'];
	var dateTime="";

	mysql.fetchTime(function(time){
		dateTime="Last Login: "+time;
			});
	
	
	var updateTime= "update test.users SET lastLogin = '"+dateTime+"' where emailid ='"+email+"' && password ='"+password+"'";
	mysql.fetchData(function(err,results){
		if(err){
			
			throw err;
		}
		else 
		{
			
			res.clearCookie('session');
			res.clearCookie('suggs');
			res.clearCookie('category');
			res.clearCookie("Allhighlight");
			res.clearCookie("yourhighlight");
			ejs.renderFile('./views/start.ejs',function(err, result) {
				   // render on success
				   if (!err) {
				            res.end(result);
				   }
				   // render or error
				   else {
				            res.end('An error occurred');
				            console.log(err);
				   }
			   });	
			
		}
	},updateTime);

}

//------------------------------------New Logics for reviews-------------------------------------------------

function postReview(req,res){
	var authenticate = req.cookies.session;
	var arr = authenticate.split(",");

	var email = arr[0];
	var password = arr[1];
	var dateTime = "";
	if(authenticate === null){
		res.send("<script>{ if(!alert('You are not logged in!!/nTo post review Login to Yelp')) document.location = '/';}</script>You are not logged in..!! Click to <a href='/login'>Go HOME</a>!.");
		}
	else{
		var review = req.param("reviewMatter");
		var category = req.param("categories");

		var rating = req.param("rate");
		if(rating===undefined){rating="0";}
		var description = req.param("description");
		var element = "";
		var perform = req.cookies.action;
		var postInsert="";
		var insertReview="";
		if(perform==='add'){
			element = req.param("newElement");
			insertReview = "INSERT INTO `test`.`reviews`(`Time`,`email`,`password`,`category`,`elements`,`Review`,`Rating`,`Like`) VALUES (CURRENT_TIMESTAMP,'"+email+"', '"+password+"','"+category+"','"+element+"','"+review+"', '"+rating+"','0');";
			postInsert = "INSERT INTO `test`.`elements`(`ElementName`,`Category`,`Description`,`Rating`,`ReviewsTotal`) VALUES ('"+element+"','"+category+"','"+description+"','"+rating+"','1');";
		}

		else
		{
			element = req.param("element");
			insertReview = "INSERT INTO `test`.`reviews`(`Time`,`email`,`password`,`category`,`elements`,`Review`,`Rating`,`Like`) VALUES (CURRENT_TIMESTAMP,'"+email+"', '"+password+"','"+category+"','"+element+"','"+review+"', '"+rating+"','0');";
			postInsert="UPDATE `test`.`elements` SET `ReviewsTotal`=ReviewsTotal+1 WHERE `ElementName`='"+element+"' AND Category ='"+category+"';";
		}
		
		mysql.fetchData(function(err,results){
			if(err){
				
				throw err;
			}
			else 
			{
		
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						
					}
				},postInsert);
				
			}
		},insertReview);
	
		res.send("<script>{ if(!alert('Posted Successfully!!')) document.location = '/';}</script>Posted Successfully..!! Click to <a href='/'>Go HOME</a>!.");
	}
	    	
}

//-------------Edit Review-----------------------

function editReview(req,res){
	var authenticate = req.cookies.session;
	var arr = authenticate.split(",");

	var email = arr[0];
	var password = arr[1];
	var dateTime = "";
	if(authenticate === null){
		res.send("<script>{ if(!alert('You are not logged in!!/nTo post review Login to Yelp')) document.location = '/';}</script>You are not logged in..!! Click to <a href='/login'>Go HOME</a>!.");
		}
	var pid = req.param("id_No"); //post id
	var preview = req.param("edit"); //post review
	var prating =req.param("rate"); //post rating
	if(prating===undefined){prating="0";}

	console.log("This is Editing details you get");
	console.log(preview);
	console.log(prating);
	console.log(pid);
	
	var updateReview = "update `test`.`reviews` SET `Review` ='"+preview+"', `Rating` ='"+prating+"' WHERE `ReviewId`='"+pid+"' AND `email` ='"+email+"' AND `password`= '"+password+"';";
	console.log(updateReview);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{}
		},updateReview);
	res.send("<script>{ if(!alert('Edited Successfully!!')) document.location = '/';}</script>Edited Successfully..!! Click to <a href='/'>Go HOME</a>!.");	
}

function deletePost(req,res){
	var authenticate = req.cookies.session;
	var arr = authenticate.split(",");

	var email = arr[0];
	var password = arr[1];
	var dateTime = "";
	if(authenticate === null){
		res.send("<script>{ if(!alert('You are not logged in!!/nTo post review Login to Yelp')) document.location = '/';}</script>You are not logged in..!! Click to <a href='/login'>Go HOME</a>!.");
		}
	var valueId = req.param("id_NoDel");
	var element = req.param("elementNameDel");
	var category = req.param("categoryDel");
	
	var deleteUpdate = "UPDATE `test`.`elements` SET `ReviewsTotal`=ReviewsTotal-1 WHERE `ElementName`='"+element+"' AND Category ='"+category+"';";
	var deleteQuery="DELETE FROM `test`.`reviews` WHERE `ReviewId` = '"+valueId+"';";
	
	console.log(valueId);
	console.log(element);
	console.log(category);
	console.log("Here we got it --------------------------");
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{}
		},deleteUpdate);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{}
		},deleteQuery);
	
	res.send("<script>{ if(!alert('Deleted Successfully!!')) document.location = '/';}</script>Deleted Successfully..!! Click to <a href='/'>Go HOME</a>!.");	
}

exports.deletePost=deletePost;
exports.editReview=editReview;
exports.postReview=postReview;
exports.start=start;
exports.signup=signup;
exports.login=login;
exports.loginrequest=loginrequest;
exports.afterSignIn=afterSignIn;
exports.logout=logout;
