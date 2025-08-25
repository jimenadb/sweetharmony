//--------------LOGIN---------------------

document.getElementById("loginForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  const data = { email, password };

  try {
    const response = await fetch("http://localhost/sweetharmony/php/LoginForm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); 
      console.log("Login exitoso");
      window.location.href = "DashboardUser.html";
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
