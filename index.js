const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
//const Routes = require('./routes');
const waiter = require('./waiter-availability.js');
const session = require('express-session');
const flash = require('express-flash');
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


app.use(flash());

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

app.get('/waiters', function (req, res) {

    res.render('index')
})

app.post('/', function (req, res) {

    res.render('index')
})

// app.post('/weedays', async function (req, res) {


//     res.render('weekdays')
// })

// app.get('/waiters', async function(req, res){


//     res.render('waiters')
// })

app.get('/days', async function (req, res) {

    const waiters = await Wavailability.getWaiters()

    res.render('days', {
        getList: waiters
    })
})

app.get('/waiters/:username', async function (req, res) {
    var name = (req.params.username);

    res.render('waiters',{
        waiter_name:name
    })
})

app.post('/waiters/:username', async function (req, res) {

    var name = _.capitalize(req.params.username);

   // console.log(name + "tyuiortyuitgh");

    var days = req.body.checkmark;


    await Wavailability.addWaiters(name)
    
    await Wavailability.workFlow(days, name)
    if (!days) {
        req.flash('error', 'Please choose a day(s) that you that you would like to work on')
        res.render('waiters');
        return;
    }

    // else if (name === undefined) {
    //     req.flash('error', 'Oops! you forgot to enter your name, Please enter your name ')
    //     res.render('waiters');
    //     return;
    // }

    // else if (isNaN(name) === false) {
    //     req.flash('error', "Please don't enter a number")
    //     res.render('index');
    //     return;
    // }

    res.render('waiters',{
        username : name,
        shift: days
    })
})




app.get('/reset', async function (req, res) {

    await Wavailability.deleteDataFromWaiters()

    res.render('reset')
})

// app.get('/waiters/:user', async function (req, res) {

//     const user = req.params.name;

//     const theUser = await Wavailability.getWaiterByName(user)


//     var days = req.body.checkbox;

//     if (!days) {
//         req.flash('error', 'Please choose a day(s) that you that you would like to work on')
//         res.render('waiters:user');
//         return;

//     }

//     res.render('waiters/:user', { insertedName: `Hello, ${theUser},  please select the days that you're available on` })
// })


const PORT = process.env.PORT || 3000
app.listen(PORT, function () {

});