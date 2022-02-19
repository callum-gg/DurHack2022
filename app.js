const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
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
    db.all("SELECT name, coords FROM bars", [], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.post('/bar/order', (req, res) => {
    let matrix = new Array(req.body.bars.length).fill(new Array(req.body.bars.length).fill(0));
    db.all("SELECT * FROM distances", [], (err, rows) => {
        if (err) {console.log(err)}
        for (let i=0;i<req.body.bars.length;i++) {
            for (let j=0; j<rows.length; j++) {
                console.log(req.body.bars[i], rows[j].bar1, rows)
                if (rows[j].bar1 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar2) !== -1) {
                    console.log(req.body.bars.indexOf(rows[j].bar2), rows[j].duration)
                    matrix[req.body.bars.indexOf(rows[j].bar2)][0] = rows[j].duration;
                } else if (rows[j].bar2 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar1) !== -1) {
                    console.log(req.body.bars.indexOf(rows[j].bar1), rows[j].duration)
                    matrix[req.body.bars.indexOf(rows[j].bar1)][0] = rows[j].duration;
                }
            }
        }
        //run python
        console.log(matrix)
        let dataToSend;
        const python = spawn('python', ['solver.py', matrix]);
        python.stdout.on('data', data => {
            dataToSend = data.toString();
        });
        python.on('close', (code) => {
            console.log(dataToSend)
            //send data back to client
        })
    });
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