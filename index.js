const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require("pg");
let AvoShopper = require("./avo-shopper");
const Pool = pg.Pool;



const app = express();
const PORT =  process.env.PORT || 3019;

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/avo_shopper';

const pool = new Pool({
    connectionString
});

const avoShop = AvoShopper(pool)

let counter = 0;

app.get('/', function(req, res) {
	res.render('index', {
		counter
	});
});

app.get('/Shops',async function(req, res) {

// await avoShop.createShop(req.body.shops)

	res.render('addShop');
});
app.post('/Shops',async function(req, res) {

	await avoShop.createShop(req.body.shops)
	
		res.redirect('shopList');
	});

app.get('/shopList',async function(req, res) {
	const listShop = await avoShop.listShops()
	res.render('shopList',{
		  listShop
	});

	app.get('/newDeal',async function(req, res) {

			res.render('newDeal');
		});

	
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});