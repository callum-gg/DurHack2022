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
    }).then(resp => {
        //response = {coords, opening/closing, entrance, college drink, challenge}
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
        //response = ordered array of college bars
    })//.catch(err => {

    //})
}