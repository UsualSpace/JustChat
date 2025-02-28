// sidebar variables
const sidebar = document.getElementById('sidebar')

// signup verification variables
const form = document.getElementById('form')
const firstname = document.getElementById('firstname')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const password = document.getElementById('password')
const password2 = document.getElementById('password2')


// sidebar functions
function toggleSideBar(){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')

    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show')
        ul.previousElementSibling.classList.remove('rotate')
    })
}
// end of side bar functions

// sign up verification
form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
});

// error output
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}

// success output
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

// function to check if the email is valid
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const firstnameValue = firstname.value.trim();
    const lastnameValue = lastname.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const password2Value = password.value.trim();

    if(firstnameValue === '') {
        setError(firstname, 'First name is required')
    } else {
        setSuccess(firstname)
    }

    if(lastnameValue ==='') {
        setError(lastname, 'Last name is required')
    } else {
        setSuccess(lastname)
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
    } else if (!isValidEmail(emailValue)) { // checks if it is a valid email
        setError(email, 'Provide a valid email address');
    } else {
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Password is required');
    } else if (passwordValue.length < 8) {
        setError(password, 'Password must be at least 8 characters.');
    } else {
        setSuccess(password);
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
    } else {
        setSuccess(password2);
    }
}
// end of sign up validation

// function to blur password
function togglePassword() {
    let passField = document.getElementById("password");
    passField.type = (passField.type  === "password") ? "text" : "password";
}

// email check with database
document.getElementById("email").addEventListener("blur", async function () {
    const email = this.value;

    if(email) {
        try{
            let response = await fetch("https://localhost:3000/check-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            let result = await response.json();

            if(result.exists) {
                document.getElementById("email-message").textContent = "✅ Email is registered!";
                document.getElementById("email-message").style.color = "green";
            } else {
                document.getElementById("email-message").textContent = "❌ Email not found!";
                document.getElementById("email-message").style.color = "red";
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
});