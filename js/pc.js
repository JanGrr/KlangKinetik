// JavaScript-Logik speziell für die PC-Seite
console.log('JavaScript-Logik für die PC-Seite wird ausgeführt.');

const websocket = new WebSocket('ws://192.168.2.175:3001'); // IP-Adresse des PCs

websocket.addEventListener('open', (event) => {
    console.log('Verbindung hergestellt');
});

websocket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Empfangene Gyroskop-Daten:', data);

    // Hier kannst du die Daten weiter verarbeiten oder in der UI anzeigen
    updateUI(data);
});

websocket.addEventListener('close', (event) => {
    console.log('Verbindung geschlossen');
});

websocket.addEventListener('error', (event) => {
    console.error('Fehler bei der Verbindung:', event);
});

function updateUI(data) {
    // Hier kannst du die Gyroskop-Daten in der UI darstellen
    // Zum Beispiel könntest du sie in einem HTML-Element aktualisieren
    document.getElementById('gyroValues').innerHTML = `
        <p>Alpha: ${data.alpha.toFixed(2)}</p>
        <p>Beta: ${data.beta.toFixed(2)}</p>
        <p>Gamma: ${data.gamma.toFixed(2)}</p>
    `;
}