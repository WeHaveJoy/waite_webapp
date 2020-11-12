const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
//const Routes = require('./routes');
const waiter = require('./waiter-availability.js');
const session = require('express-session');
//const flash = require('express-flash');
const _ = require('lodash');

const app = express();

const pg = require("pg");
const Pool = pg.Pool;

// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:pg123@localhost:5432/waiter_availability';

const pool = new Pool({
    connectionString
});

const Wavailability = waiter(pool);


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));


//app.use(flash());

//setup template handlebars as the template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

//setup middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: "./views/layouts"
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {

    res.render('index')
})

app.post('/', function(req, res){

    res.render('index')
})

app.post('/weedays', async function(req, res){


    res.render('weekdays')
})

// app.get('/waiters', async function(req, res){

   
//     res.render('waiters')
// })


app.get('/waitersList',async function(req, res){

const waiters = await Wavailability.getWaiters()

    res.render('waitersList', {
        getList: waiters 
    })
})

app.get('/waiters', async function(req, res){

    var name = _.upperCase(req.body.nameEntered);
    var days = req.body.checkbox;

    await Wavailability.workFlow(name,days)

    if(name === undefined){
        req.flash('error','Oops! you forgot to enter your name, PLease enter your name ' )
    }
    else if(!days){
        req.flash('error', 'Please choose a day(s) that you that you would like to on')

    }

    res.render('waiters')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, function () {

});