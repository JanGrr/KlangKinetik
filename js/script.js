document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    const playButton = document.getElementById('playButton');
    const rotationOutput = document.getElementById('rotation-output');
    const music = new Audio('Audio/Song.mp3');
    let isMusicPlaying = false;

    window.addEventListener('deviceorientation', handleOrientation);
    gammaSlider.addEventListener('input', handleGammaSlider);
    playButton.addEventListener('click', toggleMusic);

    function handleOrientation(event) {
        const alpha = event.alpha || 0; // Z-Rotation
        const beta = event.beta || 0;   // X-Rotation
        const gamma = event.gamma || 0; // Y-Rotation

        // Verwende den Gamma-Wert aus dem Slider oder den vom Gyroskop
        const shiftValue = gammaSlider.value || gamma;
        stage.style.left = `${shiftValue}px`;

        // Output the rotation values
        rotationOutput.innerText = `Alpha: ${alpha.toFixed(2)}°, Beta: ${beta.toFixed(2)}°, Gamma: ${gamma.toFixed(2)}°`;
    }

    function handleGammaSlider() {
        // Aktualisiere die Position basierend auf dem Slider-Wert
        const shiftValue = gammaSlider.value;
        stage.style.left = `${shiftValue}px`;
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