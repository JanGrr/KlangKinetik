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

    // tells which song out of musicList is playing
    let song_index = 0;

    //load website without soundwaves
    stopSoundwaves();

    playpause.addEventListener('click', toggleAudio);
    nextSong.addEventListener('click', nextTrack);
    prevSong.addEventListener('click', prevTrack);

    // To start and pause music
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

    // Change the time of the song when user uses the progress slider
    progress.onchange = function(){
        // if user uses progress slider before hitting play a single time
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

    // Initializes Audio and creates StereoPanner for 360 Sound
    function initAudio() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        panNode = audioContext.createStereoPanner();
        music = new Audio(musicList[song_index].src);
        const source = audioContext.createMediaElementSource(music);
        source.connect(panNode);
        panNode.connect(audioContext.destination);

        music.addEventListener('loadedmetadata', function() { // waiting untill audio initialization finished
            // initialize progress Bar
            progress.max = music.duration;
            progress.value = music.currentTime;
            
            // show duration of song
            let durationMinutes = Math.floor(music.duration / 60);
            let durationSeconds = Math.floor(music.duration % 60);
            if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
            if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

            total_song_duration.textContent = durationMinutes + ":" + durationSeconds;
        });
    
        music.addEventListener('ended', nextTrack); // play next song when song is finished

        //update current sing time and progress slider periodically
        setInterval(()=>{
            progress.value = music.currentTime;
            let currentMinutes = Math.floor(music.currentTime / 60);
            let currentSeconds = Math.floor(music.currentTime % 60);
            if(currentSeconds < 10) {currentSeconds = "0" + currentSeconds;}
            if(currentMinutes < 10) {currentMinutes = "0" + currentMinutes;}
            curr_song_time.textContent = currentMinutes + ":" + currentSeconds;
        },500);
    }

    // Plays next song
    function nextTrack(){
        // no action if play wasnt hit a single time yet
        if (isMusicInitialized) {
            // stop current song
            if (isMusicPlaying) {music.pause();}
            // update song_index
            if(song_index < (musicList.length - 1)){
                song_index += 1;
            } else {
                song_index = 0;
            }
            
            initAudio(); // Initialize new song
            // play new song
            playpauseIcon.classList.remove("fa-play");
            playpauseIcon.classList.add("fa-pause")
            music.play();
        }
    }

    // Plays previous song
    function prevTrack(){
        // no action if play wasnt hit a single time yet
        if (isMusicInitialized) {
            // stop current song
            if (isMusicPlaying) {music.pause();}
            // update song_index
            if(song_index > 0){
                song_index -= 1;
            } else {
                song_index = musicList.length - 1;
            }
            
            initAudio(); // Initialize new song
            // play new song
            playpauseIcon.classList.remove("fa-play");
            playpauseIcon.classList.add("fa-pause")
            music.play();
        }
    }

    // Starts soundwave animation
    function startSoundwaves() {
        soundWaves.forEach(wave => {
            wave.style.animationPlayState = 'running';
            wave.style.height = '100%';
        });
    }

    // Stopps soundwave animation
    function stopSoundwaves() {
        soundWaves.forEach(wave => {
            wave.style.animationPlayState = 'paused';
            wave.style.height = '10%';  // weirdly isnt applied to every wave
        });
    }

    window.addEventListener('deviceorientation', handleOrientation);

    // adjusts sound direction to sensor data
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

         // Range: -1 to 1
         if (alpha >= 0 && alpha <= 180) {
            alpha = -alpha / 180;
        } else {
            alpha = 1 - ((alpha - 180)/180);
        }
         

        let debug1 = document.getElementById("debug1");
        let debug2 = document.getElementById("debug2");
        debug1.innerText = "panValue: " + alpha;

        // e.g sound just left when turned right 90°
        if (alpha >= -0.5 && alpha <= 0.5) {
            panNode.panvalue = alpha * -2;
        } else {
            if (alpha >= 0) {
                alpha = (-alpha + 1) * -2;
                music.volume = 1 - (alpha - 0.5);
            } else {
                alpha = (-alpha - 1) * -2;
                music.volume = 1 - (-alpha - 0.5);
            }
        }
        debug2.innerText = "Laustärke: " + music.volume;

            switch (window.screen.orientation.type) {
				case 'portrait-primary':
					break;
				case 'landscape-primary':
                    panNode.pan.value = -alpha; // invert
					break;
				case 'landscape-secondary':
                    panNode.pan.value = alpha;
                    break
			}
        }
    }
});