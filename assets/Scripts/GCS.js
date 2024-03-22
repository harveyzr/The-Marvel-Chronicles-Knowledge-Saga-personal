const btnback = document.getElementById('btnback');
const modal = document.getElementById('modal');
const acptbtn = document.getElementById('acptbtn');

btnback.addEventListener('click', () => {
    modal.style.display = 'block';
  });

acptbtn.addEventListener('click', () => {
    modal.style.display = 'none';
    
    window.location.href = 'index.html';
  });

const quizButton = document.getElementById('quizButton');
const modals = document.getElementById('modal-1');
const proceed = document.getElementById('proceed');

quizButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

proceedButton.addEventListener('click', () => {
    modal.style.display = 'none';
    
    window.location.href = 'Quizpg.html';
  });
