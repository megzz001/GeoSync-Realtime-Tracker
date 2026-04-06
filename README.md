# 📍 Realtime Device Tracker

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-blue)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

A realtime GPS tracking web app that allows multiple users/devices to share their live location on a common map — similar to Uber/Zomato tracking.

---

## 🚀 Features
- 📡 Live GPS tracking  
- ⚡ Realtime updates with Socket.io  
- 🗺️ Interactive maps using Leaflet  
- 👥 Multiple users with unique markers  
- ❌ Auto-remove marker on disconnect  

---

## 🛠️ Tech Stack
- Node.js  
- Express.js  
- Socket.io  
- Leaflet.js  
- EJS  

---

## 📦 Installation

```bash
npm init -y
npm install express ejs socket.io
```

---

## Folder Structure

project/
├── public/
│   ├── css/
│   │   └── leaflet.min.css
│   ├── js/
│   │   ├── leaflet.min.js
│   │   └── script.js
├── views/
│   └── index.ejs
├── app.js
└── package.json

---
## 🔁 How It Works

1. User opens app → connects via Socket.io  
2. Browser sends GPS location continuously  
3. Server broadcasts to all clients  
4. Map updates markers in realtime  
5. Disconnect → marker removed instantly  

---

## 📌 Future Enhancements

- Authentication  
- Custom markers/icons  
- Route tracking  
- Deployment  
