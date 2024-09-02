document.addEventListener('DOMContentLoaded', function () {
    loadProfileSection();
});

function loadProfileSection() {
    fetch('profile.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.container').insertAdjacentHTML('afterbegin', data);
        });
}