document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    const playButton = document.getElementById('playButton');
    const rotationOutput = document.getElementById('rotation-output');
    const alphaSlider = document.getElementById('alphaSlider');
    const panSlider = document.getElementById('panSlider');

    let isMusicPlaying = false;
    let audioContext, panNode, music;

    window.addEventListener('deviceorientation', handleOrientation);
    alphaSlider.addEventListener('input', handleAlphaSlider);
    panSlider.addEventListener('input', handlePanSlider);
    
    playButton.addEventListener('click', function() {
        if (!isMusicPlaying) {
            initAudio();
        }
        toggleMusic();
    });

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        panNode = audioContext.createStereoPanner();
        music = new Audio('Audio/Song.mp3');
        const source = audioContext.createMediaElementSource(music);
        source.connect(panNode);
        panNode.connect(audioContext.destination);
    }

    function handleOrientation(event) {
        const alpha = event.alpha || 0; // Z-Rotation
        const beta = event.beta || 0;   // X-Rotation
        const gamma = event.gamma || 0; // Y-Rotation

        // Verwende den Alpha-Wert aus dem Slider oder den vom Gyroskop
        const shiftPercentage = (alphaSlider.value || alpha)*4 - 720; // Umrechnung in Prozent
        stage.style.left = `${shiftPercentage}%`;

        // Output the rotation values
        rotationOutput.innerText = `Alpha: ${alpha.toFixed(2)}°, Beta: ${beta.toFixed(2)}°, Gamma: ${gamma.toFixed(2)}°`;
    }

    function handleAlphaSlider() {
        // Aktualisiere die Position basierend auf dem Slider-Wert
        const shiftPercentage = alphaSlider.value*4 - 720; // Umrechnung in Prozent
        stage.style.left = `${shiftPercentage}%`;
    }

    function handlePanSlider() {
        // Aktualisiere die Pan-Position basierend auf dem Slider-Wert
        const panValue = (panSlider.value - 50) / 50; // Bereich: -1 bis 1
        panNode.pan.value = panValue;
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
            audioContext.resume().then(() => {
                music.play();
                isMusicPlaying = true;
                playButton.innerText = 'Pause';
            });
        }
    }
});