const generatePassword = () => {
    const lengthInput = document.getElementById('length');
    const lengthValue = parseInt(lengthInput.value);

    if (lengthValue < 12 || lengthValue > 50) {
        alert("La longitud de la contraseña debe estar entre 12 y 50 caracteres.");
        return;
    }

    const password = generateRandomPassword(lengthValue);
    const passwordResult = document.querySelector(".passwordResult");
    const copybtn = document.getElementById("copybtn");
    const clearbtn = document.getElementById("clearbtn");
    const showPasswordContainer = document.getElementById('showPasswordContainer');

    // Mostrar los botones de copiar, borrar y el checkbox
    copybtn.classList.remove("hidden");
    clearbtn.classList.remove("hidden");
    showPasswordContainer.classList.remove("hidden");
    
    // Mostrar la contraseña en el DOM
    let passwordSpan = document.getElementById('generatedPassword');
    if (!passwordSpan) {
        passwordSpan = document.createElement('span');
        passwordSpan.id = 'generatedPassword';
        passwordResult.innerHTML = `Contraseña Generada: `;
        passwordResult.appendChild(passwordSpan);
    }

    // Guardar la contraseña en el dataset
    passwordSpan.dataset.password = password;

    // Mostrar la contraseña como estrellitas
    updatePasswordDisplay();
}

const generateRandomPassword = (lengthValue) => {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()-_=+";

    let password = "";

    // Asegurar al menos un carácter de cada tipo
    password += getRandomChar(uppercaseChars);
    password += getRandomChar(lowercaseChars);
    password += getRandomChar(numberChars);
    password += getRandomChar(symbolChars);

    // Generar el resto de la contraseña
    const allChars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
    for (let i = password.length; i < lengthValue; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars.charAt(randomIndex);
    }

    return password;
}

const getRandomChar = (characters) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
}

const copyToClipboard = () => {
    const passwordSpan = document.getElementById('generatedPassword');
    if (passwordSpan) {
        const password = passwordSpan.dataset.password;
        navigator.clipboard.writeText(password).then(() => {
            // Crear un mensaje de confirmación
            let confirmationMessage = document.getElementById('confirmationMessage');
            if (!confirmationMessage) {
                confirmationMessage = document.createElement('div');
                confirmationMessage.id = 'confirmationMessage';
                document.querySelector('.passwordResult').appendChild(confirmationMessage);
            }
            confirmationMessage.style.display = 'inline-block';
            confirmationMessage.textContent = 'Contraseña copiada correctamente ✔';

            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => {
                confirmationMessage.textContent = '', confirmationMessage.style.display='none';
            }, 3000);
        }).catch(err => {
            console.error('Error al copiar la contraseña: ', err);
        });
    } else {
        alert('No hay ninguna contraseña generada para copiar.');
    }
}

const clearPassword = () => {
    const passwordResult = document.querySelector(".passwordResult");
    const copybtn = document.getElementById("copybtn");
    const clearbtn = document.getElementById("clearbtn");
    const showPasswordContainer = document.getElementById('showPasswordContainer');

    // Ocultar los botones de copiar, borrar y el checkbox
    copybtn.classList.add("hidden");
    clearbtn.classList.add("hidden");
    showPasswordContainer.classList.add("hidden");

    // Limpiar el contenido del div de resultado
    passwordResult.innerHTML = '';
}

const updatePasswordDisplay = () => {
    const passwordSpan = document.getElementById('generatedPassword');
    const showPasswordCheckbox = document.getElementById('showPassword');

    if (passwordSpan) {
        const password = passwordSpan.dataset.password;
        if (showPasswordCheckbox.checked) {
            passwordSpan.textContent = password;
        } else {
            passwordSpan.textContent = '*'.repeat(password.length);
        }
    }
}

const togglePasswordVisibility = () => {
    updatePasswordDisplay();
}

// Seleccionar los botones y agregar los event listeners
const pwdbtn = document.getElementById("pwdbtn");
const copybtn = document.getElementById("copybtn");
const clearbtn = document.getElementById("clearbtn");
const showPasswordCheckbox = document.getElementById('showPassword');

pwdbtn.addEventListener("click", generatePassword);
copybtn.addEventListener("click", copyToClipboard);
clearbtn.addEventListener("click", clearPassword);
showPasswordCheckbox.addEventListener("change", togglePasswordVisibility);