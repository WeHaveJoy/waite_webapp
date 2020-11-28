const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const waiter = require('./waiter-availability.js');
const Routes = require('./routes');
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
const routes = Routes(Wavailability);


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

app.get('/waiters/', routes.index)

app.post('/', routes.index)


app.post('/days', routes.days)

app.get('/days', routes.days)

app.get('/waiters/:username',routes.getWaiters)

app.post('/waiters/:username', routes.postWaiters)


app.get('/reset', routes.reset)



const PORT = process.env.PORT || 3000
app.listen(PORT, function () {

});