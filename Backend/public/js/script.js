const socket = io();
const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markers = {};

function getDisplayCoordinates(id, latitude, longitude) {
    // Small deterministic offset per socket so users at same GPS point remain visible.
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash << 5) - hash + id.charCodeAt(i);
        hash |= 0;
    }

    const angle = Math.abs(hash % 360) * (Math.PI / 180);
    const distance = 0.00006;

    return [
        latitude + Math.cos(angle) * distance,
        longitude + Math.sin(angle) * distance
    ];
}

function updateUserMarker(id, latitude, longitude) {
    const [displayLat, displayLng] = getDisplayCoordinates(id, latitude, longitude);
    const isSelf = id === socket.id;

    if (!markers[id]) {
        markers[id] = L.circleMarker([displayLat, displayLng], {
            radius: isSelf ? 9 : 7,
            color: isSelf ? "#145da0" : "#c81d25",
            fillColor: isSelf ? "#2e8bc0" : "#ff4d4d",
            fillOpacity: 0.9,
            weight: 2
        }).addTo(map);
    } else {
        markers[id].setLatLng([displayLat, displayLng]);
    }

    markers[id].bindTooltip(isSelf ? "You" : `User ${id.slice(0, 5)}`, {
        direction: "top",
        offset: [0, -8]
    });

    if (isSelf) {
        map.setView([latitude, longitude], 16);
    }
}

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
});

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(Position => {
        const { latitude, longitude } = Position.coords;

        if (socket.id) {
            updateUserMarker(socket.id, latitude, longitude);
        }
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

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
        return;
    }

    updateUserMarker(id, latitude, longitude);
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});