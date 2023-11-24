document.addEventListener('DOMContentLoaded', function () {
    var audioPlayer = document.getElementById('audioPlayer');

    function handleFileSelect(input) {
        var file = input.files[0];

        var reader = new FileReader();
        reader.onload = function (e) {
            audioPlayer.src = e.target.result;
            audioPlayer.play();
        };

        reader.readAsDataURL(file);
    }
});