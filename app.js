var express = require('express');
var routes = require('./routes');

var user = require('./routes/user');
var http = require('http');
var path = require('path');
var home = require('./routes/home');

var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

// These are the new imports we're adding:
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');

var app = express();



//app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


// all environments
app.set('port', process.env.PORT || 8082);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.session({secret: "vaibhav namdev secret key"}));


// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

app.get('/', home.start);
app.get('/start', home.start);
app.get('/signup', home.signup);
app.get('/login',home.login);
app.get('/logout',home.logout);
app.post('/loginrequest',home.loginrequest);
app.post('/afterSignIn', home.afterSignIn);
app.get('/postReview', home.postReview);
app.get('/editReview',home.editReview);
app.post('/deletePost',home.deletePost);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Yelp Dummy Server is listining on port:  ' + app.get('port'));
});
