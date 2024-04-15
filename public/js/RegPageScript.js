const input = document.getElementById('myInput2');
let schoolName = ''; // Изначально значение пустое

input.addEventListener('input', function() {
  schoolName = input.value; // Обновляем значение переменной при изменении ввода
});

var schools //Массив школ
              window.onload = function() {
            fetch('/registration/regme')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при выполнении запроса: ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    // Сохраняем массив объектов для дальнейшей работы
                    processSchools(data);
                })
                .catch(error => {
                    if (error.message === 'Failed to fetch') {
                        console.error('Нет интернет-соединения');
                    } else {
                        console.error('Ошибка при обработке запроса:', error);
                    }
                });
        };

        function processSchools(schools) {
            var dataList = document.getElementById('myList2');
            dataList.innerHTML = ''; // Очистить существующие элементы списка

            schools.forEach(function(school) {
            var option = document.createElement('option');
            option.value = school.name; // Предположим, что у школ есть поле 'name'
            dataList.appendChild(option);
            });
        }

        function registration(){

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