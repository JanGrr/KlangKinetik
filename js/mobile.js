// JavaScript-Logik speziell für die Handy-Seite
console.log('JavaScript-Logik für die Handy-Seite wird ausgeführt.');

const websocket = new WebSocket('ws://192.168.2.175:3001'); // IP-Adresse des PCs

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, false);
}

function handleOrientation(event) {
    const data = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
    };

    // Sende Gyroskop-Daten über WebSocket
    websocket.send(JSON.stringify(data));
}