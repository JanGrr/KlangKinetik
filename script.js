document.addEventListener('DOMContentLoaded', function () {
    var audioPlayer = document.getElementById('audioPlayer');
    var accelerationXElement = document.getElementById('accelerationX');
    var accelerationYElement = document.getElementById('accelerationY');
    var accelerationZElement = document.getElementById('accelerationZ');

    window.addEventListener('devicemotion', handleMotion);

    function handleMotion(event) {
        var acceleration = event.accelerationIncludingGravity;

        // Zeige die Beschleunigungswerte an
        accelerationXElement.textContent = acceleration.x.toFixed(2);
        accelerationYElement.textContent = acceleration.y.toFixed(2);
        accelerationZElement.textContent = acceleration.z.toFixed(2);
    }
});