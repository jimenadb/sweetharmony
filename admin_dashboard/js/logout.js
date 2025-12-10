document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost/sweetharmony/sweetharmony/admin_dashboard/php/logout.php", {
            method: "POST",
            credentials: "include" // si usas cookies de sesión
        });

        const data = await res.json();
        if (data.success) {
            // Redirigir al login
            window.location.href = "../../login_register_user/html/LoginForm.html";
        } else {
            alert("Error al cerrar sesión");
        }
    } catch (err) {
        console.error("Error al cerrar sesión:", err);
    }
});
