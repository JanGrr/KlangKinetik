document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const debug = document.getElementById('debug');

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
        music = new Audio('../Audio/Song.mp3');
        const source = audioContext.createMediaElementSource(music);
        source.connect(panNode);
        panNode.connect(audioContext.destination);
    }

    window.addEventListener('deviceorientation', handleOrientation);
    function handleOrientation(event) {
        let alpha = event.alpha; // Z-Rotation 
        const beta = event.beta;   // X-Rotation
        const gamma = event.gamma; // Y-Rotation

        if (gamma < 0 && gamma > -90) { // to bypass 'gimbal lock' problem of Euler angles
            if (alpha < 180) {
                alpha += 180;
            } else {
                alpha -= 180;
            }
        }

        if(isMusicPlaying) {
            panvalue = (alpha-180)/180 // Bereich: -1 bis 1
            if (panvalue >= -0.5 && panvalue <= 0.5) {
                panvalue *= -2;
            } else {
                if (panvalue >= 0) {
                    panvalue = (-panvalue + 1) * -2
                } else {
                    panvalue = (-panvalue - 1) * -2
                }
            }
            debug.innerText = panvalue;
            panNode.pan.value = panvalue;
        }
    }
});