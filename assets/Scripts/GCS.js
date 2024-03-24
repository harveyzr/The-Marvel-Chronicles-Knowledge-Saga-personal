  const backButton = document.getElementById('btnback');
  const modal = document.getElementById('modal');
  const acceptButton = document.getElementById('acptbtn');
  const declineButton = document.getElementById('declnbtn')

  backButton.addEventListener('click', () => {
      modal.style.display = 'block';
  });

  acceptButton.addEventListener('click', () => {
      window.location.href = 'index.html';
  });

  declineButton.addEventListener('click', () => {
     modal.style.display = "none";
  });
    