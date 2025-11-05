document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("profileForm");
  
    // Cargar datos del usuario
    fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/get_user_profile.php', { credentials: 'include' })
      .then(res => res.json())
      .then(user => {
        document.getElementById('first_name').value = user.first_name;
        document.getElementById('last_name').value = user.last_name;
        document.getElementById('email').value = user.email;
      });
  
    // Guardar cambios
    form.addEventListener("submit", async e => {
      e.preventDefault();
  
      const data = {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        current_password: form.current_password.value,
        new_password: form.new_password.value
      };
  
      try {
        const res = await fetch('http://localhost/sweetharmony/sweetharmony/dashboard/php/update_user_profile.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include'
        });
  
        const result = await res.json();
        alert(result.message);
      } catch (err) {
        console.error(err);
        alert("Error al actualizar el perfil.");
      }
    });
  });
  
  
// TOGGLE

  document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
      const input = icon.previousElementSibling; // input al que pertenece
      if (input.type === 'password') {
        input.type = 'text';
        icon.name = 'eye-off-outline';
      } else {
        input.type = 'password';
        icon.name = 'eye-outline';
      }
    });
  });