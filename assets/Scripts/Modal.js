const quizButton = document.getElementById('quizButton');
const modals = document.getElementById('modal-1');
const proceed = document.getElementById('proceed');

quizButton.addEventListener('click', () => {
    modals.style.display = 'block';
});

proceed.addEventListener('click', () => {
    modals.style.display = 'none';
    
    window.location.href = 'Quizpg.html';
});
