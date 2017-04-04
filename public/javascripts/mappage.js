/**
 * Created by Kyle on 2017-04-04.
 */

function initMap() {
    var halifax = {lat: 44.663, lng: -63.599};
    window.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: halifax
    });
}

var socket = io();

window.vehicles = [];

socket.on('position-update', function(data){
    console.log('Position Data Received');
    for (var i = 0; i < window.vehicles.length; i++) {
        window.vehicles[i].setMap(null);
    }
    window.vehicles = [];
    data.forEach(function(element){
        var marker = new google.maps.Marker({
            position: {lat: element['lat'], lng: element['lng']},
            map: window.map
        });
        window.vehicles.push(marker);
    });
});

socket.on('error', function(data){
    console.error('Error getting position data');
    console.error(data);
})