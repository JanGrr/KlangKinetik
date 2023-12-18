document.addEventListener('DOMContentLoaded', function() {
    const stage = document.getElementById('stage');
    const playButton = document.getElementById('playButton');
    const rotationOutput = document.getElementById('rotation-output');
    const alphaSlider = document.getElementById('alphaSlider');
    const panSlider = document.getElementById('panSlider');

    let isMusicInitialized = false;
    let isMusicPlaying = false;
    let audioContext, panNode, music;
    
    playButton.addEventListener('click', toggleAudio);

    function toggleAudio() {
        if (!isMusicInitialized) {
            initAudio();
            isMusicInitialized = true;
        }
        if (isMusicPlaying) {
            music.pause();
            isMusicPlaying = false;
            playButton.innerText = 'Play';
        } else {
            audioContext.resume().then(() => {
                music.play();
                isMusicPlaying = true;
                playButton.innerText = 'Pause';
            });
        }
    };

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        panNode = audioContext.createStereoPanner();
        music = new Audio('Audio/Song.mp3');
        const source = audioContext.createMediaElementSource(music);
        source.connect(panNode);
        panNode.connect(audioContext.destination);
    }

    window.addEventListener('deviceorientation', handleOrientation);
    function handleOrientation(event) {
        const alpha = event.alpha; // Z-Rotation
        const beta = event.beta;   // X-Rotation
        const gamma = event.gamma; // Y-Rotation
        
        // Verwende den Alpha-Wert aus dem Slider oder den vom Gyroskop
        //const shiftPercentage = ((alphaSlider.value || alpha)-180)*4; // Umrechnung in Prozent
        const shiftPercentage = (alpha-180);
        stage.style.left = `${shiftPercentage}%`;
        panNode.pan.value = (alpha-180)/180; // Bereich: -1 bis 1

        // Output the rotation values
        rotationOutput.innerText = `Alpha: ${alpha.toFixed(2)}°, Beta: ${beta.toFixed(2)}°, Gamma: ${gamma.toFixed(2)}°`;
    }

    alphaSlider.addEventListener('input', handleAlphaSlider);
    function handleAlphaSlider() {
        // Aktualisiere die Position basierend auf dem Slider-Wert
        const shiftPercentage = (alphaSlider.value-180)*4; // Umrechnung in Prozent
        stage.style.left = `${shiftPercentage}%`;
    }

    panSlider.addEventListener('input', handlePanSlider);
    function handlePanSlider() {
        // Aktualisiere die Pan-Position basierend auf dem Slider-Wert
        const panValue = (panSlider.value - 50) / 50; // Bereich: -1 bis 1
        panNode.pan.value = panValue;
    }
});