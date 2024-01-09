import musicList from './music_list.js';

document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playButton');
    const soundWaves = document.querySelectorAll('.sound-waves .wave');

    // to initialize audio on first press on play
    let isMusicInitialized = false;

    // tells if music is playing
    let isMusicPlaying = false;

    // to create the 360 sound
    let audioContext, panNode, music;

    let progress = document.getElementById("progress-slider");
    let playpause = document.getElementById("playpause-container");
    let playpauseIcon = document.getElementById("playpause");
    let nextSong = document.getElementById("next-song-container");
    let prevSong = document.getElementById("prev-song-container");
    let curr_song_time = document.getElementById("current-song-time");
    let total_song_duration = document.getElementById("total-song-duration");
    let song_index = 0;

    //load website without soundwaves
    stopSoundwaves();

    playpause.addEventListener('click', toggleAudio);
    nextSong.addEventListener('click', nextTrack);
    prevSong.addEventListener('click', prevTrack);

    function toggleAudio() {
        if (!isMusicInitialized) {
            initAudio();
            isMusicInitialized = true;
        }
        if (playpauseIcon.classList.contains("fa-pause")) {
            isMusicPlaying = false;
            music.pause();
            stopSoundwaves();
            playpauseIcon.classList.remove("fa-pause");
            playpauseIcon.classList.add("fa-play");
        } else {
            audioContext.resume().then(() => {
                music.play();
                isMusicPlaying = true;
                startSoundwaves();
                playpauseIcon.classList.remove("fa-play");
                playpauseIcon.classList.add("fa-pause");
            });
        }
    }

    progress.onchange = function(){
        if (!isMusicInitialized) {
            initAudio();
            isMusicInitialized = true;
        }
        music.currentTime = progress.value;
        music.play();
        startSoundwaves();
        isMusicPlaying = true;
        playpauseIcon.classList.remove("fa-play");
        playpauseIcon.classList.add("fa-pause");
    }

    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        panNode = audioContext.createStereoPanner();
        music = new Audio(musicList[song_index].src);
        const source = audioContext.createMediaElementSource(music);
        source.connect(panNode);
        panNode.connect(audioContext.destination);

        music.addEventListener('loadedmetadata', function() {
            // initialize progress Bar
            progress.max = music.duration;
            progress.value = music.currentTime;
    
            let durationMinutes = Math.floor(music.duration / 60);
            let durationSeconds = Math.floor(music.duration % 60);
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }
            
            total_song_duration.textContent = durationMinutes + ":" + durationSeconds;
        });
    
        music.addEventListener('ended', nextTrack);

        setInterval(()=>{
            progress.value = music.currentTime;
            let currentMinutes = Math.floor(music.currentTime / 60);
            let currentSeconds = Math.floor(music.currentTime % 60);
            if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds;}
            if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes;}
            curr_song_time.textContent = currentMinutes + ":" + currentSeconds;
        },500);
    }

    function nextTrack(){
        if (isMusicInitialized) {
            if (isMusicPlaying) {music.pause();}
            if(song_index < (musicList.length - 1)){
                song_index += 1;
            } else {
                song_index = 0;
            }
            initAudio();
            playpauseIcon.classList.remove("fa-play");
            playpauseIcon.classList.add("fa-pause")
            music.play();
        }
    }

    function prevTrack(){
        if (isMusicInitialized) {
            if (isMusicPlaying) {music.pause();}
            if(song_index > 0){
                song_index -= 1;
            } else {
                song_index = musicList.length - 1;
            }
            initAudio();
            playpauseIcon.classList.remove("fa-play");
            playpauseIcon.classList.add("fa-pause")
            music.play();
        }
    }

    function startSoundwaves() {
        soundWaves.forEach(wave => {
            wave.style.animationPlayState = 'running';
            wave.style.height = '100%';
        });
    }

    function stopSoundwaves() {
        soundWaves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
            wave.style.height = '10%';
        });
    }

    window.addEventListener('deviceorientation', handleOrientation);

    function handleOrientation(event) {
        if(isMusicPlaying) {
            let alpha = event.alpha; // Z-Rotation 
            //const beta = event.beta;   // X-Rotation not used
            const gamma = event.gamma; // Y-Rotation
    
            if (gamma < 0 && gamma >= -90) { // to bypass 'gimbal lock' problem of Euler angles
                if (alpha < 180) {
                    alpha += 180;
                } else {
                    alpha -= 180;
                }
            }

            let panvalue = (alpha-180)/180 // Bereich: -1 bis 1
            if (panvalue >= -0.5 && panvalue <= 0.5) {
                panvalue *= -2;
            } else {
                if (panvalue >= 0) {
                    panvalue = (-panvalue + 1) * -2
                } else {
                    panvalue = (-panvalue - 1) * -2
                }
            }
            switch (window.screen.orientation.type) {
				case 'portrait-primary':
					break;
				case 'landscape-primary':
                    panNode.pan.value = -panvalue;
					break;
				case 'landscape-secondary':
                    panNode.pan.value = panvalue;
                    break
			}
        }
    }
});