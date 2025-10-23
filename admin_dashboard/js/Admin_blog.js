
    // Abrir modal de edición
    const editButtons = document.querySelectorAll('.edit-btn');
    const modal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');

    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    });

    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

  // Abrir modal de formulario
  
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formSection = document.getElementById('newPostSection');
  
    toggleBtn.addEventListener('click', () => {
      formSection.style.display = formSection.style.display === 'none' || formSection.style.display === ''
        ? 'block'
        : 'none';
    });
  
    // Inicialmente ocultamos el formulario
    formSection.style.display = 'none';