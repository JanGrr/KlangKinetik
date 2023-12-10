if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, false);
}

function handleOrientation(event) {
    var alpha = event.alpha; // Drehrate um die Z-Achse
    var beta = event.beta;   // Neigung um die X-Achse
    var gamma = event.gamma; // Neigung um die Y-Achse

    // Aktualisiere die Werte auf der Website
    document.getElementById('alphaValue').innerText = alpha.toFixed(2);
    document.getElementById('betaValue').innerText = beta.toFixed(2);
    document.getElementById('gammaValue').innerText = gamma.toFixed(2);
}