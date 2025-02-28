document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent form from refreshing

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send credentials to backend for verification
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
        document.getElementById("message").innerText = "✅ Login Successful!";
    } else {
        document.getElementById("message").innerText = "❌ Invalid Credentials";
    }
});