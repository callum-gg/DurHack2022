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

function add_new_bar(new_bar) {
    fetch('/bar/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({new_bar})
    }).then(resp => {
        //response = ordered array of college bars
    })//.catch(err => {

    //})
}


// code that effects the functionality of the website by charlie
function show_bar_choice(){
    document.getElementById("choices").style.display = "block";
};

// this loads the diffrent bars into ingredence

window.addEventListener('load', function () {
    // This loads the bars to begin
    console.log("here")
    fetch(`/bar/getAll`, {
        method: 'GET',
    }).then(resp => resp.json()).then(resp => {
        console.log(resp)
        // here it adds all the bars to the ingredence list selcting them

        // here it calls a function that creats the div that lets you select the diffrent bars.
        creat_bar_selctor(resp)

    })
});


function creat_bar_selctor(bars){
    
    // it then loops through adding a selctor for each bar
    for (let i = 0; i < bars.length; i++) {
        let bar = bars[i].name; // this stores the name of each bar
        console.log(bar)


        let div = document.getElementById("choisingbars");
        console.log('div')
        document.getElementById("choisingbars").innerHTML += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="`+bar+`" id="flexCheckChecked" checked>
          <label class="form-check-label" for="flexCheckChecked">
            `+bar+`
          </label>
        </div>
        `
    }
     console.log(div_bars);
     document.getElementById("choices").appendChild(div_bars);

    
}

function update_bar_crawl(){
    // write code that works out what bars have been clicked

    console.log("cakks get bar crawl details")
}

function add_bar(){

    const longlat = document.getElementById("longlat").value;
    const bar_name = document.getElementById('bar_name').value;
    const args = {"name": bar_name, "coords": longlat};

    document.getElementById("longlat").value = '';
    document.getElementById('bar_name').value = '';


    add_new_bar(args);

    location.reload();
   
}