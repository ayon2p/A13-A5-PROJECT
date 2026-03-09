const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        const inputUsername = document.getElementById('input-username');
        const inputPassword = document.getElementById('input-password');

        if (inputUsername && inputPassword) {
            const inputName = inputUsername.value;
            const pass = inputPassword.value;

            if (inputName === "admin" && pass === "admin123") {
              localStorage.setItem('isLoggedIn', 'true');
                window.location.href = "home.html";
            } else {
                alert('your password is incorrect!');
            }
        }
    });
}

if (window.location.pathname.includes('home.html')) {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        alert('again try this');
        window.location.href = "index.html"; 
    } else {
     
        loadInitialData();
    }
}
