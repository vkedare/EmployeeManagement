var express=require("express");
var bodyParser=require("body-parser");
require('dotenv').config();

const PORT = process.env.PORT || 3000 ;

const MONGODB_URL = process.env.MONGODB_URI;

const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL);
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app=express()


app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/sign_up', function(req,res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email =req.body.email;
	var pass = req.body.password;
	var phone =req.body.phone;

	var data = {
		"firstname": firstname,
		"lastname": lastname,
		"email":email,
		"password":pass,
		"phone":phone
	}
db.collection('Admin').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('signup_success.html');
})

app.post('/sign_in', function(req,res){
	var email =req.body.email;
	var pass = req.body.password;


	var data = {
		"email":email,
		"password":pass
	}

	db.collection('Admin').findOne(data,function(err, collection){
		if (err) throw err;
		if (collection == null){
			console.log("Invalid Email Id or Password");
			return res.redirect('signin_fail.html');
		} else {
			console.log("Successfully Logged in");
			return res.redirect('main_menu.html');
		}	
	});
	
})

app.post('/add_employee', function(req,res){
	var empid = req.body.empid;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var age =req.body.age;
	var gender = req.body.gender
	var email =req.body.email;
	var phone =req.body.phone;

	var data = {
		"empid": empid, // "empid": "1
		"firstname": firstname,
		"lastname": lastname,
		"age":age,
		"gender":gender,
		"email":email,
		"phone":phone
	}
db.collection('Employee').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('add_success.html');
})

app.post('/update_employee', function(req,res){
	var empid = req.body.empid;
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var age =req.body.age;
	var gender = req.body.gender
	var email =req.body.email;
	var phone =req.body.phone;

	var find = { "empid": empid}

	var data ={"$set": {
		"firstname": firstname,
		"lastname": lastname,
		"age":age,
		"gender":gender,
		"email":email,
		"phone":phone
	}}
db.collection('Employee').findOneAndUpdate(find, data,function(err, collection){
		if (err) throw err;
		console.log("Record Updated Successfully");
			
	});
		
	return res.redirect('update_success.html');
})

app.post('/find_employee', function(req,res){
	var empid = req.body.empid;


	var data = {
		"empid": empid
	}
db.collection('Employee').findOne(data,function(err, collection){
		if (err) throw err;
		if (collection == null){
			console.log("Employee Not Found");
			return res.redirect('find_failure.html');
		} else {
			console.log("Employee Found", collection);
			return res.redirect('find_success.html');
		}	
			
	});
		
	
})

app.post('/delete_employee', function(req,res){
	var empid = req.body.empid;


	var data = {
		"empid": empid
	}
db.collection('Employee').deleteOne(data,function(err, collection){
		if (err) throw err;
		console.log("Successfully Deleted");
			
	});
		
	return res.redirect('delete_success.html');
})

app.get('/',function(req,res){
res.set({
	'Access-control-Allow-Origin': '*'
	});
return res.redirect('index.html');
})

app.get('/sign_in',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('signin.html');
	})

app.get('/find_employee',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('find.html');
	})

app.get('/add_employee',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('add.html');
	})

app.get('/update_employee',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('update.html');
	})
	
app.get('/delete_employee',function(req,res){
	res.set({
		'Access-control-Allow-Origin': '*'
		});
	return res.redirect('delete.html');
	})	

	

module.exports = app.listen(PORT);
console.log(`server listening at port ${PORT}`);