document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    const playButton = document.getElementById('playButton');
    const rotationOutput = document.getElementById('rotation-output');
    const music = new Audio('Audio/Song.mp3');
    let isMusicPlaying = false;

    window.addEventListener('deviceorientation', handleOrientation);
    alphaSlider.addEventListener('input', handleAlphaSlider);
    playButton.addEventListener('click', toggleMusic);

    function handleOrientation(event) {
        const alpha = event.alpha || 0; // Z-Rotation
        const beta = event.beta || 0;   // X-Rotation
        const gamma = event.gamma || 0; // Y-Rotation

        // Verwende den Alpha-Wert aus dem Slider oder den vom Gyroskop
        const shiftPercentage = (alphaSlider.value || alpha) / 360 * 100; // Umrechnung in Prozent
        stage.style.left = `${shiftPercentage}%`;

        // Output the rotation values
        rotationOutput.innerText = `Alpha: ${alpha.toFixed(2)}°, Beta: ${beta.toFixed(2)}°, Gamma: ${gamma.toFixed(2)}°`;
    }

    function handleAlphaSlider() {
        // Aktualisiere die Position basierend auf dem Slider-Wert
        const shiftPercentage = alphaSlider.value*4 - 720; // Umrechnung in Prozent
        stage.style.left = `${shiftPercentage}%`;
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