const btnAgregar = document.getElementById('btnAgregar');
    const form = document.getElementById('formularioAgregar');
    btnAgregar.addEventListener('click', () => {
      form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });