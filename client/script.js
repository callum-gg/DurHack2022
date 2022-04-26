let number_bars = 0;
let current_route, shareid

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
    fetch(`/user/get`, {
        method: 'GET'
    }).then(resp => resp.json()).then(resp => {
        if (resp.loggedIn) {
            shareid = resp.shareid;
            document.getElementById('main-button').innerText = "College Bars";
            document.getElementById('main-button').setAttribute("data-bs-target", "#barsModal");

            fetch(`/bar/getAll`, {
                method: 'GET',
            }).then(resp => resp.json()).then(resp => {
                create_bar_selector(resp)
        
            });

            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('share')) {
                checkShared(urlParams.get('share'));
            }
        }
    })
});


function create_bar_selector(bars){
    
    // it then loops through adding a selctor for each bar
    for (let i = 0; i < bars.length; i++) {
        let bar = bars[i].name; // this stores the name of each bar
        number_bars += 1;

        document.getElementById("choisingbars").innerHTML += `
        <div class="bars-form">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="`+bar+`" id="bar_${i}" checked>
                <label class="form-check-label" for="bar+${i}">${bar}</label>
            </div>
            <div class="form-check-actions">
                ${""/*<button class="form-button" onclick="editLocation('${bar}');"><i class="fa-solid fa-pencil"></i></button>*/}
                <button class="form-button" onclick="deleteLocation('${bar}')"><i class="fa-solid fa-trash"></i></button>
                <button class="form-button" onclick='shareLocation(\`${JSON.stringify(bars[i])}\`)'><i class="fa-solid fa-share"></i></button>
            </div>
        </div>`
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
        document.getElementById("bar_percentage").innerText = Math.round(percent) + "%";

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
                url = url.slice(0, -1);
            }
            document.querySelector('#map').setAttribute("src", url)
            current_route = resp;
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

function deleteLocation(bar) {
    fetch('/bar/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({bar})
    }).then(() => {
        location.reload();
    })
}

function shareLocation(bar) {
    bar = JSON.parse(bar);
    $('#barsModal').modal("toggle");
    fetch('/share/location', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({location: bar})
    }).then(resp => resp.json()).then(resp => {
        document.querySelector('#shareModalLabel').innerText = "Location Link:";
        $('#shareModal').modal("toggle");
        document.getElementById("shareLink").value = `${window.location.hostname}/?share=${resp.shareid}`;
    })
}

function shareRoute() {
    if (current_route) {
        fetch('/share/route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({route: current_route})
        }).then(resp => resp.json()).then(resp => {
            document.querySelector('#shareModalLabel').innerText = "Location Link:";
            $('#shareModal').modal("toggle");
            document.getElementById("shareLink").value = `${window.location.hostname}/?share=${resp.shareid}`;
        })
    } else {
        alert('You need to create a route first!');
    }
}

function checkShared(shareid) {
    fetch(`/share/get?shareid=${shareid}`, {
        method: 'GET'
    }).then(resp => resp.json()).then(resp => {
        if (resp.type === "location") {
            document.querySelector('#bar_name').value = resp.location.name;
            document.querySelector('#longlat').value = resp.location.coords;
            $('#barsModal').modal('show');
        } else if (resp.type === "route") {
            let url = `https://www.google.com/maps/embed/v1/directions?
key=AIzaSyDvBY_k1J6aWeB71ReE8EuC08jrf-dJYJ0
&mode=walking
&origin=${resp.route[0].coords}
&destination=${resp.route[resp.route.length-1].coords}`;
            if (resp.route.length > 2) {
                url = `${url}&waypoints=`
                for (var i=1; i<resp.route.length-1; i++) {
                    url = `${url}${resp.route[i].coords}|`
                }
                url = url.slice(0, -1);
            }
            document.querySelector('#map').setAttribute("src", url)
            current_route = resp.route;
        }
    })
}

function copyShareLink() {
  var copyText = document.getElementById("shareLink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);
  document.querySelector('#linkAlert').style.opacity = 1;
}