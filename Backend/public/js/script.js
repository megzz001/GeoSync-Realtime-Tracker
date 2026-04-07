const socket = io();
let selfMarker = null;

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

function updateSelfMarker(latitude, longitude) {
    if (!selfMarker) {
        selfMarker = L.marker([latitude, longitude]).addTo(map);
    } else {
        selfMarker.setLatLng([latitude, longitude]);
    }

    map.setView([latitude, longitude], 16);
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(Position => {
        const { latitude, longitude } = Position.coords;

        // Render own location immediately so the marker appears even before socket echo.
        updateSelfMarker(latitude, longitude);
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        const errorMap = {
            1: "Permission denied. Allow location access in the browser.",
            2: "Position unavailable. Turn on GPS/location services.",
            3: "Location request timed out. Try again with a stable network."
        };
        console.error("Error getting location:", errorMap[error.code] || error.message);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0 // No caching of location
    });
} else {
    console.error("Geolocation is not supported in this browser.");
}

const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {

}

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return;
    }

    if (id === socket.id) {
        updateSelfMarker(latitude, longitude);
        return;
    }

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});