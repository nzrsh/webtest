let input = document.getElementById('myInput2');
let intervalId
const selectElement = document.getElementById('myList');
const radioButtons = document.querySelectorAll('input[name="rate_2"]');
let element2 = document.getElementById("myInput2");

let schoolName = ''; // Изначально значение пустое

input.addEventListener('input', function () {
    schoolName = input.value;
});

// Обработчик события для изменений в элементе select
selectElement.addEventListener('change', function() {
    input.value = '';
    element2.disabled = true;
    intervalId = setInterval(createSpisok, 1000);
});

// Обработчики событий для radio buttons
radioButtons.forEach(radioButton => {
    radioButton.addEventListener('change', function() {
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
        })
        .catch(error => {
            if (error.message === 'Failed to fetch') {
                console.error('Нет интернет-соединения');
            } else {
                console.error('Ошибка при обработке запроса:', error);
            }
        });
};


function processSchools(schools, value1, value2) {
    var dataList = document.getElementById('myList2');
    dataList.innerHTML = ''; // Очистить существующие элементы списка
    schools.forEach(function (school) {
        if (school.district == value1 && school.spec == value2) {
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

    if (selectValue !== "" && rate2Value != null) {
        console.log("Значение в выпадающем списке и чекбоксе выбраны");
        clearInterval(intervalId);
        processSchools(schools, selectValue, rate2Value.value); 

    }
}



function registration() {
    let schoolName = document.getElementById('myInput2').value;
    let selectValue = document.getElementById('myList').value;
    let rate2Value = document.querySelector('input[name="rate_2"]:checked').value;
    let login = document.getElementById('login').value;
    let password = document.getElementById('password').value;
    let password2 = document.getElementById('password2').value;

    if (password !== password2) {
        console.error('Пароли не совпадают');
        return;
    }

    console.log(schoolName, selectValue, rate2Value, login,password,password2);

    if (schoolName && selectValue && rate2Value && login && password) {
        let data = {
            name: schoolName,
            district: selectValue,
            spec: rate2Value,
            login: login,
            password: password
        };

        fetch('/registration/reguser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.status === 200) {
                console.log('Запрос успешно отправлен');
                alert("Регистрация прошла успешно!");
                window.location.href = '/'
            } else if (response.status === 500) {
                response.text().then(errorMessage => {
                    console.error(errorMessage);
                    alert(errorMessage);
                });
            } else {
                console.error('Неожиданный статус ответа:', response.status);
            }
        })
        .catch(error => {
            console.error('Произошла ошибка при отправке запроса:', error);
            alert('Произошла ошибка при отправке запроса. Проверьте подключение к интернету.', error);
        });
    } else {
        console.error('Пожалуйста, заполните все поля формы!');
        alert('Пожалуйста, заполните все поля формы!');
    }
}

var passwordInput = document.getElementById('password');
var password2Input = document.getElementById('password2');

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