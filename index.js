var express = require('express');
var app = express();
app.set('view engine', 'ejs');
// index page 
app.get('/', function(req, res) {
    res.render('test');
});

// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});

console.log('localhost:3000');
app.listen(3000);
