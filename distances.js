// h
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./data.sql');

function work_out_all(new_bar, database_bar){
    for (let i = 0; i < database_bar.length; i++) {
        let bar = database_bar[i];

        let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=' + new_bar.coords + '&origins=' + bar.coords + '&units=imperial&key=AIzaSyDvBY_k1J6aWeB71ReE8EuC08jrf-dJYJ0'
        axios.get(url)
        .then(res => {
    
            const dist = res.data.rows[0].elements;

            let data_for_db = [new_bar.name, bar.name, dist[0].distance.value, dist[0].duration.value]

            // adding it to the database

            db.run(`INSERT INTO distances(bar1, bar2, distance, duration) VALUES(?,?,?,?)`, data_for_db, function(err) {
                if (err) {
                  return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
              });

        })
        .catch(err => {
            console.log('Error: ', err.message);
        });


    }
}

module.exports = {
    work_out_all
  };

