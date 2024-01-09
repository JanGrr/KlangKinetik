window.addEventListener("orientationchange", function() {
    location.reload();
});

var mainContainer = document.querySelector('.main-container');
mainContainer.style.height = window.innerHeight;