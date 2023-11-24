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

        var playbackSpeed = totalAccelerationMath;
        audioPlayer.playbackRate = playbackSpeed;

        var volume = Math.min(1, playbackSpeed);
        audioPlayer.volume = volume;

        console.log("Total Acceleration: " + totalAccelerationMath);
        console.log("Playback Speed: " + playbackSpeed);

        if (audioPlayer.paused) {
            if (totalAccelerationMath > 1) {
                console.log("Starting playback.");
                audioPlayer.play();
            }
        }
    }
});