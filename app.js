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

app.get('/bar/get', (req, res) => {
    console.log(req.query.bar);
    db.all("SELECT * FROM bars WHERE name=?", [req.query.bar], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.post('/bar/order', (req, res) => {
    console.log(req.body);
    res.end("Hello World")
});

app.listen(3000);