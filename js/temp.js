document.addEventListener('DOMContentLoaded', function() {
    const rotationOutput = document.getElementById('rotation-output');

    window.addEventListener('deviceorientation', handleOrientation);

    function handleOrientation(event) {
        const alpha = event.alpha; // Z-Rotation
        const beta = event.beta;   // X-Rotation
        const gamma = event.gamma; // Y-Rotation

        if (gamma < 0 && gamma > -90) { // to bypass 'gimbal lock' problem of Euler angles
            if (alpha < 180) {
                alpha += 180;
            } else {
                alpha -= 180;
            }
        }
        
        // Hier kannst du die Werte in HTML-Elementen aktualisieren
        rotationOutput.innerHTML = `
            <p>Alpha: ${alpha.toFixed(2)}°</p>
            <p>Beta: ${beta.toFixed(2)}°</p>
            <p>Gamma: ${gamma.toFixed(2)}°</p>
        `;
    }
});