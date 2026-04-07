const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(Position => {
        const { latitude, longitude } = Position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.error("Error getting location: ", error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0 // No caching of location
    });
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {

}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});