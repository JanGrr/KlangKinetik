document.addEventListener('DOMContentLoaded', function () {
    var audioPlayer = document.getElementById('audioPlayer');
    var accelerationX = document.getElementById('accelerationX');
    var accelerationY = document.getElementById('accelerationY');
    var accelerationZ = document.getElementById('accelerationZ');
    var totalAcceleration = document.getElementById('totalAcceleration');
    var start = false;

    window.addEventListener('devicemotion', handleMotion);

    function handleMotion(event) {
        var acceleration = event.acceleration;

        // Zeige die Beschleunigungswerte an
        accelerationX.textContent = acceleration.x.toFixed(2);
        accelerationY.textContent = acceleration.y.toFixed(2);
        accelerationZ.textContent = acceleration.z.toFixed(2);

        var playbackSpeed = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
        totalAcceleration.textContent = playbackSpeed.toFixed(2);

        if(!start) {
            console.log("start: " + start);
            if (playbackSpeed > 1) {
                start = true;
                audioPlayer.play();
            }
        } else if (playbackSpeed > 0.4) {
            console.log("playbackSpeed: " + playbackSpeed);
            audioPlayer.play();
            audioPlayer.playbackRate = playbackSpeed;
            var volume = Math.min(1, playbackSpeed);
            audioPlayer.volume = volume;
        } else {
            console.log("paused");
            audioPlayer.pause();
        }
    }
});