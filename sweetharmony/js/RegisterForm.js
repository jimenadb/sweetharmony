document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const new_password = document.getElementById("new_password").value;

  if (password !== new_password) {
    alert("Las contraseñas no coinciden");
    return;
  }

  const data = {
    first_name: document.getElementById("first_name").value,
    last_name: document.getElementById("last_name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value || null,
    address: document.getElementById("address").value || null,
    city_id: document.getElementById("city_id").value || null,
    department: document.getElementById("department").value || null,
    province: document.getElementById("province").value || null,
    postal_code: document.getElementById("postal_code").value || null,
    password: password,
  };

  try {
    const response = await fetch("http://localhost/sweetharmony/php/RegisterForm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      console.log("Registro correcto:", result);
      window.location.href = "LoginForm.html";
    } else {
      alert("Error en el registro: " + result.message);
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