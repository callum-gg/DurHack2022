// h
const axios = require('axios');

function distances(place1, place2){
    let url = 'https://maps.googleapis.com/maps/api/distancematrix/json?destinations=' + place1 + '&origins=' + place2 + '&units=imperial&key=AIzaSyAaKfCdw4jDuY1rZcH_hMW3nCwKfM8uWLI'
    axios.get(url)
    .then(res => {

        const dist = res.data;
        console.log(dist)
        return dist.rows[0].elements;
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
}

function work_out_all(new_bar, database_bar){
    console.log("sdf")
    for (let i = 0; i < database_bar.length; i++) {
        let bar = database_bar[i];
        console.log(bar.coords)
        let dist = distances(new_bar.coords, bar.coords);
        console.log(dist);

    }

    // loop through other bars are work out how far.
    // loop
    // store
}

module.exports = {
    work_out_all
  };

