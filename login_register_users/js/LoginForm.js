//--------------LOGIN---------------------

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const data = { email, password };

  try {
    //const response = await fetch("http://158.69.214.32/ximena_flores/sweetharmony/login_register_users/php/LoginForm.php", {
    const response = await fetch("http://localhost/sweetharmony/sweetharmony/login_register_users/php/LoginForm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // ✅ Aquí va el if principal
    if (response.ok) {
      const role = result.role; // Asegúrate de que PHP devuelva también el rol
      sessionStorage.setItem('username', result.username);
      sessionStorage.setItem('user_id', result.user_id);
  
      // Redirección según rol directamente en JS
      if (role === 'admin') {
          window.location.href = "http://localhost/sweetharmony/sweetharmony/admin_dashboard/html/Admin_catalogo.html";
      } else if (role === 'user') {
          window.location.href = "http://localhost/sweetharmony/sweetharmony/dashboard/html/Dashboard.html";
      } else {
          // Fallback por si no hay rol
          window.location.href = "http://localhost/sweetharmony/sweetharmony/dashboard/html/Dashboard.html";
      }
    } else {
      alert("Credenciales incorrectas");
      console.error("Error:", result);
    }

  } catch (err) {
    console.error("Error de conexión:", err);
    alert("No se pudo conectar con el servidor");
  }
});

  
  //TOGGLE
  function togglePassword(inputId, el) {
    const input = document.getElementById(inputId);
  
    if (input.type === "password") {
      input.type = "text";
      el.classList.remove("fa-eye");
      el.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      el.classList.remove("fa-eye-slash");
      el.classList.add("fa-eye");
    }
  }
