document.addEventListener('DOMContentLoaded', function () {
    var audioPlayer = document.getElementById('audioPlayer');
    var accelerationX = document.getElementById('accelerationX');
    var accelerationY = document.getElementById('accelerationY');
    var accelerationZ = document.getElementById('accelerationZ');
    var totalAcceleration = document.getElementById('totalAcceleration');

    window.addEventListener('devicemotion', handleMotion);

    function handleMotion(event) {
        var acceleration = event.acceleration;

        // Zeige die Beschleunigungswerte an
        accelerationX.textContent = acceleration.x.toFixed(2);
        accelerationY.textContent = acceleration.y.toFixed(2);
        accelerationZ.textContent = acceleration.z.toFixed(2);

        var totalAccelerationMath = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
        totalAcceleration.textContent = totalAccelerationMath.toFixed(2);

        /*var playbackSpeed = calculatePlaybackSpeed(totalAccelerationMath);
        audioPlayer.playbackRate = playbackSpeed;*/
    }

    /*function calculatePlaybackSpeed(totalAcceleration) {
        return (totalAcceleration / 10) - 1;
    }*/

});