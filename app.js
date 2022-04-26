const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
//var indexRouter = require('./index');
const authRouter = require('./auth');
var logger = require('morgan');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var path = require('path')
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data.sql');


// db.all("SELECT * FROM bars", [], (err, rows) => {
//     console.log(rows) 
// });

//function Add

const app = express();
app.use(express.static('client'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './' })
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use('/', indexRouter);
app.use('/', authRouter);

let d = require('./distances.js');
// const { array } = require('assert-plus');

app.get('/user/get', (req, res) => {
    let returnData = {};
    if (req.session.passport && req.session.passport.user) {
        returnData.loggedIn = true;
        returnData.shareid = req.session.passport.user.share;
    } else {
        returnData.loggedIn = false;
    }

    res.send(JSON.stringify(returnData))
});

app.get('/bar/get', (req, res) => {
    db.all("SELECT * FROM bars WHERE name=?", [req.query.bar], (err, rows) => {
        if (err) {console.log(err)}
        res.end(JSON.stringify(rows))
    });
});

app.get('/bar/getAll', (req, res) => {
    if (req.session.passport && req.session.passport.user) {
        db.all("SELECT name, coords FROM bars WHERE userid=? OR userid IS NULL", [String(req.session.passport.user.id)], (err, rows) => {
            if (err) {console.log(err)}
            res.end(JSON.stringify(rows))
        });
    }
});

let inUseShares = [];
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const shareLength = 8;
function createShareId() {
  let inUse = true;
  let id = '';
  while (inUse) {
    for (let i=0; i<shareLength; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    if (!inUseShares.includes(id)) {
      inUseShares.push(id);
      inUse = false;
    } else {
      id = '';
    }
  }
  return id
}

let shares = {}
app.get('/share/get', (req, res) => {
    if (shares[req.query.shareid]) {
        res.end(JSON.stringify(shares[req.query.shareid]))
    } else {
        res.end(JSON.stringify({type: "Unknown"}))
    }
});

app.post('/share/location', (req, res) => {
    let shareid = createShareId();
    shares[shareid] = {
        type: "location",
        location: req.body.location
    }
    res.end(JSON.stringify({shareid}));
});

app.post('/share/route', (req, res) => {
    let shareid = createShareId();
    shares[shareid] = {
        type: "route",
        route: req.body.route
    }
    res.end(JSON.stringify({shareid}));
});

app.post('/bar/order', (req, res) => {
    let matrix = [];
    for (let i=0; i<req.body.bars.length; i++) {
        matrix.push(new Array(req.body.bars.length).fill(0))
    }
    db.all("SELECT * FROM distances", [], (err, rows) => {
        if (err) {console.log(err)}
        for (let i=0;i<req.body.bars.length;i++) {
            for (let j=0; j<rows.length; j++) {
                if (rows[j].bar1 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar2) !== -1) {
                    matrix[req.body.bars.indexOf(rows[j].bar2)][i] = rows[j].duration;
                } else if (rows[j].bar2 === req.body.bars[i] && req.body.bars.indexOf(rows[j].bar1) !== -1) {
                    matrix[req.body.bars.indexOf(rows[j].bar1)][i] = rows[j].duration;
                }
            }
        }
        //run python
        let shortestBars;
        const python = spawn('python', ['solver.py', JSON.stringify(matrix)]);
        python.stdout.on('data', data => {
            shortestBars = JSON.parse(data.toString());
        });
        python.on('close', (code) => {
            let orderedBars = []
            for (let i=0; i<shortestBars.length; i++) {
                db.all("SELECT coords FROM bars WHERE name=?", [req.body.bars[i]], (err, coords) => {
                    db.all("SELECT duration FROM distances WHERE (bar1=? AND bar2=?) OR (bar2=? AND bar1=?)", [req.body.bars[i], req.body.bars[i+1], req.body.bars[i], req.body.bars[i+1]], (err, duration) => {
                        if (duration[0]) {
                            orderedBars.push({name: req.body.bars[i], coords: coords[0].coords, time: duration[0].duration})
                        } else {
                            orderedBars.push({name: req.body.bars[i], coords: coords[0].coords, time: null})
                            res.end(JSON.stringify(orderedBars))
                        }
                    })
                })
            }
        })
    });
});

// this is used when adding vote to a poll.
app.post('/bar/new', function (req, res) {
    let new_bar = req.body.new_bar;

    // this adds the new bar to the table.
    db.run(`INSERT INTO bars(name, coords, userid) VALUES(?,?,?)`, [new_bar.name, new_bar.coords, String(req.session.passport.user.id)], function(err) {
        if (err) {
          return console.log(err.message);
        }
        // get the last insert id
        db.all("SELECT * FROM bars", [], (err, rows) => {
            d.work_out_all(new_bar, rows);
            res.end("success")
        });
      });
});
app.listen(3000);