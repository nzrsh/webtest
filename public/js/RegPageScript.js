let input = document.getElementById('myInput2');
let intervalId
const selectElement = document.getElementById('myList');
const radioButtons = document.querySelectorAll('input[name="rate_2"]');
let element2 = document.getElementById("myInput2");

input.addEventListener('input', function () {
    schoolName = input.value;
});

// Обработчик события для изменений в элементе select
selectElement.addEventListener('change', function () {
    input.value = '';
    element2.disabled = true;
    intervalId = setInterval(createSpisok, 1000);
});

// Обработчики событий для radio buttons
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function () {
        input.value = '';
        element2.disabled = true;
        createSpisok();
    });
});

let schools  //Массив школ
window.onload = function () {
    fetch('/registration/regme')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при выполнении запроса: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            schools = data
            createSpisok();
        })
        .catch(error => {
            if (error.message === 'Failed to fetch') {
                console.error('Нет интернет-соединения');
            } else {
                console.error('Ошибка при обработке запроса:', error);
            }
        });
};


function processSchools(schools, value1) {
    var dataList = document.getElementById('myList2');
    dataList.innerHTML = ''; // Очистить существующие элементы списка
    schools.forEach(function (school) {
        if (school.district == value1) {
            var option = document.createElement('option');
            option.value = school.name; // Предположим, что у школ есть поле 'name'
            dataList.appendChild(option);
        }
        element2.disabled = false;
    }
    );
}

function createSpisok() {
    const selectValue = document.getElementById("myList").value;
    const rate2Value = document.querySelector('input[name="rate_2"]:checked');

    if (selectValue !== "") {
        console.log("Значение в выпадающем списке и чекбоксе выбраны");
        clearInterval(intervalId);
        processSchools(schools, selectValue);

    }
}



function registration() {

    url = '/registration/reguser'
    data = { school_name: schoolName };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                console.log('Запрос успешно отправлен');
            } else {
                console.error('Произошла ошибка при отправке запроса');
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при отправке запроса:', error);
        });
}

var passwordInput = document.getElementById('password');
var password2Input = document.getElementById('password2');

passwordInput.addEventListener('input', function () {
    this.value = this.value.replace(/./g, '*');
});

password2Input.addEventListener('input', function () {
    this.value = this.value.replace(/./g, '*');
});

password2Input.addEventListener('input', function () {
    var passwordValue = passwordInput.value;
    var password2Value = password2Input.value;

    if (passwordValue === password2Value) {
        let element2 = document.getElementById("password2");
        element2.color = "green"
        element2.style.borderColor = "green";
        let element = document.getElementById("pas_lab");
        element.style.display = "block";
        element.innerText = "Пароли совпадают";
        element.style.color = "green";
    } else {
        let element2 = document.getElementById("password2");
        element2.color = "#A6114D"
        element2.style.borderColor = "#A6114D";
        let element = document.getElementById("pas_lab");
        element.style.display = "block";
        element.innerText = "Пароли не совпадают";
        element.style.color = "#A6114D";
    }
});

loginInput.addEventListener('input', function () {
    if (loginInput.value.length < 6) {
        log_lab.style.display = "block";
        log_lab.innerText = "Логин должен содержать 6-8 символов";
        log_lab.style.color = "#A6114D";
    }
    else {
        log_lab.style.display = "block";
        log_lab.innerText = "Подходящий логин";
        log_lab.style.color = "green";
    }
});

passwordInput.addEventListener('input', function () {
    if (passwordInput.value.length < 6) {
        pas_lab1.style.display = "block";
        pas_lab1.innerText = "Пароль должен содержать 6-8 символов";
        pas_lab1.style.color = "#A6114D";
    }
    else {
        pas_lab1.style.display = "block";
        pas_lab1.innerText = "Подходящий пароль";
        pas_lab1.style.color = "green";
    }
});


loginInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;
    let latinPattern = /^[a-zA-Z0-9]*$/;

    if (!latinPattern.test(inputValue)) {
        event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Удаляем все кириллические символы из введенной строки
    }
});

passwordInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;
    let latinPattern = /^[a-zA-Z0-9]*$/;

    if (!latinPattern.test(inputValue)) {
        event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Удаляем все кириллические символы из введенной строки
    }
});

password2Input.addEventListener('input', function (event) {
    let inputValue = event.target.value;
    let latinPattern = /^[a-zA-Z0-9]*$/;

    if (!latinPattern.test(inputValue)) {
        event.target.value = inputValue.replace(/[^a-zA-Z0-9]/g, ''); // Удаляем все кириллические символы из введенной строки
    }
});

loginInput.addEventListener('input', function() {
    if (loginInput.value.length > 8) {
        loginInput.value = loginInput.value.slice(0, 8); // Обрезаем логин до 8 символов
    }
});

passwordInput.addEventListener('input', function() {
    if (passwordInput.value.length > 8) {
        passwordInput.value = passwordInput.value.slice(0, 8); // Обрезаем пароль до 8 символов
    }
});

password2Input.addEventListener('input', function() {
    if (password2Input.value.length > 8) {
        password2Input.value = password2Input.value.slice(0, 8); // Обрезаем подтверждение пароля до 8 символов
    }
});