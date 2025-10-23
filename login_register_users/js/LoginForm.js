//--------------LOGIN---------------------

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const data = { email, password };

  try {
    const response = await fetch("http://158.69.214.32/ximena_flores/sweetharmony/login_register_users/php/LoginForm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    // ✅ Aquí va el if principal
    if (response.ok) {
      // Usa la URL que el backend envía
      if (result.redirect) {
        window.location.href = result.redirect;
      } else {
        // Fallback por si no viene el campo redirect
        window.location.href = "../../dashboard/html/Dashboard.html";
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
