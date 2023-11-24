document.addEventListener('DOMContentLoaded', function () {
    var accelerationXElement = document.getElementById('accelerationX');
    var accelerationYElement = document.getElementById('accelerationY');
    var accelerationZElement = document.getElementById('accelerationZ');
    var totalAccelerationElement = document.getElementById('totalAcceleration');

    window.addEventListener('devicemotion', handleMotion);

    function handleMotion(event) {
        var acceleration = event.accelerationIncludingGravity;

        // Zeige die Beschleunigungswerte an
        accelerationXElement.textContent = acceleration.x.toFixed(2);
        accelerationYElement.textContent = acceleration.y.toFixed(2);
        accelerationZElement.textContent = acceleration.z.toFixed(2);

        var totalAcceleration = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
        totalAccelerationElement.textContent = totalAcceleration.toFixed(2);
    }
});