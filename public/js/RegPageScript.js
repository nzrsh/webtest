
let selectElement = document.getElementById('myList');
let schoolSelect = document.getElementById('myList2');
//let radioButtons = document.querySelectorAll('input[name="rate_2"]');
let loginInput = document.getElementById('login');
let logLab = document.getElementById("log_lab");
let forLab = document.getElementById("for_lab");
let schools = [];

// Получаем список школ при загрузке страницы
window.onload = function () {
    fetch('/registration/regme')
        .then(response => response.json())
        .then(data => {
            schools = data;
            // Фильтруем школы при изменении муниципалитета или типа учреждения
            createSchoolList();
        })
        .catch(error => {
            console.error('Ошибка при выполнении запроса:', error);
        });
};

// Слушаем изменения в select (муниципалитет) и радиокнопках (тип учреждения)
selectElement.addEventListener('change', createSchoolList);
//radioButtons.forEach(radioButton => radioButton.addEventListener('change', createSchoolList));

// Фильтрация школ по выбранному району
function createSchoolList() {
    let districtValue = selectElement.value;
    //let institutionType = document.querySelector('input[name="rate_2"]:checked');

    // Очищаем старые школы
    schoolSelect.innerHTML = '<option value="">Выберите школу</option>';
    schoolSelect.disabled = true;

    //if (districtValue && institutionType) {
        if (districtValue) {
    let filteredSchools = schools.filter(school => school.district === districtValue);
        
        // Заполняем select отфильтрованными школами
        filteredSchools.forEach(school => {
            let option = document.createElement('option');
            option.value = school.name;
            option.text = school.name;
            schoolSelect.appendChild(option);
        });
        
        schoolSelect.disabled = false;
    }
}

// Валидация формы при регистрации
function registration() {
    let regButton = document.querySelector('.reg_bat');
    regButton.disabled = true;

    setTimeout(() => regButton.disabled = false, 3500);

    let schoolName = schoolSelect.value;
    let districtValue = selectElement.value;
    let login = loginInput.value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;

    if (password !== password2) {
        console.error('Пароли не совпадают');
        return;
    }

    if (schoolName && districtValue && login.length >= 6 && password.length >= 6) {
        let data = { name: schoolName, district: districtValue, login, password };

        fetch('/registration/reguser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            if (response.status === 200) {
                alert("Регистрация прошла успешно!");
                window.location.href = '/';
            } else if (response.status === 500) {
                return response.text().then(errorMessage => {
                    forLab.innerText = errorMessage;
                    forLab.style.display = "block";
                    setTimeout(() => forLab.style.display = "none", 3000);
                });
            } else {
                console.error('Неожиданный статус ответа:', response.status);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при отправке запроса:', error);
            alert('Произошла ошибка при отправке запроса. Проверьте подключение к интернету.');
        });
    } else {
        forLab.innerText = "Пожалуйста, заполните все поля формы корректно!";
        forLab.style.display = "block";
        setTimeout(() => forLab.style.display = "none", 3000);
    }
}

// Валидация пароля и логина при вводе
function validateInput() {
    loginInput.addEventListener('input', function () {
        if (loginInput.value.length < 6) {
            logLab.style.display = "block";
            logLab.innerText = "Логин должен содержать 6-8 символов";
            logLab.style.color = "#A6114D";
        } else {
            logLab.style.display = "block";
            logLab.innerText = "Подходящий логин";
            logLab.style.color = "green";
        }
    });

    let passwordInput = document.getElementById('password');
    let password2Input = document.getElementById('password2');

    passwordInput.addEventListener('input', function () {
        if (passwordInput.value.length < 6) {
            document.getElementById('pas_lab1').style.display = "block";
            document.getElementById('pas_lab1').innerText = "Пароль должен содержать 6-8 символов";
            document.getElementById('pas_lab1').style.color = "#A6114D";
        } else {
            document.getElementById('pas_lab1').style.display = "block";
            document.getElementById('pas_lab1').innerText = "Подходящий пароль";
            document.getElementById('pas_lab1').style.color = "green";
        }
    });

    password2Input.addEventListener('blur', function () {
        if (passwordInput.value === password2Input.value) {
            document.getElementById('password2').style.borderColor = "green";
            document.getElementById('pas_lab').style.display = "block";
            document.getElementById('pas_lab').innerText = "Пароли совпадают";
            document.getElementById('pas_lab').style.color = "green";
        } else {
            document.getElementById('password2').style.borderColor = "#A6114D";
            document.getElementById('pas_lab').style.display = "block";
            document.getElementById('pas_lab').innerText = "Пароли не совпадают";
            document.getElementById('pas_lab').style.color = "#A6114D";
        }
    });
}

// Ограничение длины логина и пароля
function limitInputLength() {
    loginInput.addEventListener('input', function () {
        if (loginInput.value.length > 8) {
            loginInput.value = loginInput.value.slice(0, 8);
        }
    });

    let passwordInput = document.getElementById('password');
    let password2Input = document.getElementById('password2');

    passwordInput.addEventListener('input', function () {
        if (passwordInput.value.length > 8) {
            passwordInput.value = passwordInput.value.slice(0, 8);
        }
    });

    password2Input.addEventListener('input', function () {
        if (password2Input.value.length > 8) {
            password2Input.value = password2Input.value.slice(0, 8);
        }
    });
}

// Убираем не латинские символы
function restrictToLatin() {
    loginInput.addEventListener('input', function (event) {
        let inputValue = event.target.value;
        let latinPattern = /^[a-zA-Z0-9]*$/;

        if (!latinPattern.test(inputValue)) {
            event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, ''); 
        }
    });

    let passwordInput = document.getElementById('password');
    let password2Input = document.getElementById('password2');

    passwordInput.addEventListener('input', function (event) {
        let inputValue = event.target.value;
        let latinPattern = /^[a-zA-Z0-9]*$/;

        if (!latinPattern.test(inputValue)) {
            event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, '');
        }
    });

    password2Input.addEventListener('input', function (event) {
        let inputValue = event.target.value;
        let latinPattern = /^[a-zA-Z0-9]*$/;

        if (!latinPattern.test(inputValue)) {
            event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, '');
        }
    });
}

// Инициализация всех валидаций и ограничений
window.addEventListener('load', () => {
    validateInput();
    limitInputLength();
    restrictToLatin();
});
