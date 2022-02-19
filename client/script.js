// function post() {
//     fetch('/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({data: 'omg this is cool'})
//     })
// }

function GetBarData(bar) {
    fetch(`/bar/get?bar=${bar}`, {
        method: 'GET',
    }).then(resp => resp.json()).then(resp => {
        console.log(resp)
    })//.catch(err => {

    // })
}

function GetBarOrder(bars, start, end) {
    fetch('/bar/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({bars, start, end})
    }).then(resp => {
        //response = ordered array of college bars {name, time to next, coords}
        let url = `https://www.google.com/maps/embed/v1/directions?
key=AIzaSyAaKfCdw4jDuY1rZcH_hMW3nCwKfM8uWLI
&mode=walking
&origin=${resp[0].coords}
&destination=${resp[resp.length-1].coords}
&waypoints=`;
        for (var i=1; i<resp.length-1; i++) {
            url = `${url}${resp[i].coords}|`
        }
    })//.catch(err => {

    //})
}