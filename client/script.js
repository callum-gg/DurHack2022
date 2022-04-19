// function post() {
//     fetch('/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({data: 'omg this is cool'})
//     })
// }
let number_bars = 0;
function GetBarData(bar) {
    fetch(`/bar/get?bar=${bar}`, {
        method: 'GET',
    }).then(resp => resp.json()).then(resp => {
        console.log(resp)
    })//.catch(err => {

    // })
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
    fetch(`/bar/getAll`, {
        method: 'GET',
    }).then(resp => resp.json()).then(resp => {
        create_bar_selector(resp)

    })
});


function create_bar_selector(bars){
    
    // it then loops through adding a selctor for each bar
    for (let i = 0; i < bars.length; i++) {
        let bar = bars[i].name; // this stores the name of each bar
        number_bars += 1;

        document.getElementById("choisingbars").innerHTML += `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="`+bar+`" id="bar_`+i+`" checked>
          <label class="form-check-label" for="flexCheckChecked">
            `+bar+`
          </label>
        </div>
        `
    }

    
}

function update_bar_crawl(){
    // write code that works out what bars have been clicked
    var bars_check = []
 
    for (let i = 0; i < number_bars; i++) {
        let bar_id = "bar_"+i;
        let tick_box_name = document.getElementById(bar_id).value;
        if (document.getElementById(bar_id).checked === true){
            bars_check.push(tick_box_name);
        }
    };

    if (bars_check.length > 1) {

        // workking out the persone tisr fdjgafmdf`
        let percent = (bars_check.length / number_bars)*100;
        document.getElementById("bar_percentage").innerText = percent + "%";

        if (percent == 100){
            alert("They are here if you need help here is a number too call:  0344 209 0754")
        }

        fetch('/bar/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({bars: bars_check})
        }).then(resp => resp.json()).then(resp => {
            //response = ordered array of college bars
            let url = `https://www.google.com/maps/embed/v1/directions?
key=AIzaSyDvBY_k1J6aWeB71ReE8EuC08jrf-dJYJ0
&mode=walking
&origin=${resp[0].coords}
&destination=${resp[resp.length-1].coords}`;
            if (resp.length > 2) {
                url = `${url}&waypoints=`
                for (var i=1; i<resp.length-1; i++) {
                    url = `${url}${resp[i].coords}|`
                }
            }
            document.querySelector('#map').setAttribute("src", url.slice(0, -1))
        })//.catch(err => {

        //})
    } else {
        alert('You need to have more than 1 bar. It\'s a bar crawl.');
    }
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