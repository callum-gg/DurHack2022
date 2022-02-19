const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data.sql');


// db.all("SELECT * FROM bars", [], (err, rows) => {
//     console.log(rows) 
// });

//function Add

const app = express();
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let d = require('./distances.js');

app.get('/bar/get', (req, res) => {
    console.log(req.query.bar);
    db.all("SELECT * FROM bars WHERE name=?", [req.query.bar], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.get('/bar/getAll', (req, res) => {
    
});

app.post('/bar/order', (req, res) => {
    console.log(req.body);
    res.end("Hello World")
});

// this is used when adding vote to a poll.
app.post('/bar/new', function (req, res) {
    let new_bar = req.body.new_bar;

    db.all("SELECT * FROM bars", [], (err, rows) => {
        console.log(rows);
        d.work_out_all(new_bar, rows);

    });
    
    res.end("Hello World")
});
app.listen(3000);