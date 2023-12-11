document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    const playButton = document.getElementById('playButton');
    const rotationOutput = document.getElementById('rotation-output');
    const music = new Audio('Audio/Song.mp3');
    let isMusicPlaying = false;

    window.addEventListener('deviceorientation', handleOrientation);

    playButton.addEventListener('click', toggleMusic);

    function handleOrientation(event) {
        const alpha = event.alpha || 0; // Z-Rotation
        const beta = event.beta || 0;   // X-Rotation
        const gamma = event.gamma || 0; // Y-Rotation

        // Update the stage position based on device orientation
        const shiftValue = gamma; // Verwende den Gamma-Wert für die Verschiebung
        stage.style.transform = `translateX(${shiftValue}px)`;

        // Output the rotation values
        rotationOutput.innerText = `Alpha: ${alpha.toFixed(2)}°, Beta: ${beta.toFixed(2)}°, Gamma: ${gamma.toFixed(2)}°`;
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            // Stop the music
            music.pause();
            music.currentTime = 0; // Zurückspulen zum Anfang
            isMusicPlaying = false;
            playButton.innerText = 'Play';
        } else {
            // Start the music
            music.play();
            isMusicPlaying = true;
            playButton.innerText = 'Pause';
        }
    }
});