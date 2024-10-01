function getResult() {
  var button = document.getElementsByClassName("get_result");
  button.disabled = true;
  setTimeout(function() {
    // Включаем кнопку обратно после 5 секунд
    button.disabled = false;
  }, 5000);

  var localStorageData = localStorage.getItem('userData');
  console.log('localStorageData:', localStorageData);

  var user;
  try {
    user = JSON.parse(localStorageData);
    console.log('user:', user);
  } catch (error) {
    console.log('Ошибка парсинга JSON:', error);
    return
  }
  var xhr = new XMLHttpRequest();
  var param1Value = user.district;
  var param2Value = user.name;
  var param3Value = user.spec;
  var url = '/results?district=' + encodeURIComponent(param1Value) + '&name=' + encodeURIComponent(param2Value) + '&spec=' + encodeURIComponent(param3Value);
  xhr.open('GET', url, true);
  xhr.timeout = 5000;
  xhr.responseType = 'blob'; // Указываем тип ответа как blob

  xhr.onload = function () {
    if (xhr.status === 200) {
      var blob = xhr.response;
      var downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = 'Результаты.zip'; 
      downloadLink.click();
    } else {
      console.log('Неуспешный ответ:', xhr.status, xhr.statusText);
      alert("Результаты тестирования ещё не сформированы!");
    }
  };

  xhr.ontimeout = function () {
    // Ошибка "Нет ответа от сервера"
    console.log('Нет ответа от сервера');
    alert("Ваше интернет соединение нестабильно или нет ответа от сервера.")
  };

  xhr.onerror = function () {
    console.log('Ошибка запроса');
    alert("Результаты тестирования ещё не сформированы!");
  };

  xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
  // Получаем данные из localStorage
  const name = localStorage.getItem('userDistrict');
  const userInstitution = localStorage.getItem('userInstitution');
  const userName = localStorage.getItem('userName');

  // Проверяем наличие данных и выводим в соответствующие div
  if (userDistrict) {
      document.getElementById('districtDisplay').textContent = 'Ваш район: ' + userDistrict;
  }

  if (userInstitution) {
      document.getElementById('institutionDisplay').textContent = 'Ваше учреждение: ' + userInstitution;
  }

  if (userName) {
      document.getElementById('nameDisplay').textContent = 'Как к вам можно обращаться: ' + userName;
  }
});




function goToReg(){
  window.location.href = '/registration';
}

function goToTech(){
  window.location.href = '/techsupport'
}

function showDiv() {
  var div = document.getElementById('infWindow');
  div.style.display = 'block';
  var p = document.getElementsByClassName('resSchool');
  for (var i = 0; i < p.length; i++) {
    p[i].style.display = 'block';
  }
}

function hideDiv() {
  var div = document.getElementById('infWindow');
  div.style.display = 'none';
  var p = document.getElementsByClassName('resSchool');
  for (var i = 0; i < p.length; i++) {
    p[i].style.display = 'none';
  }
}

function showForm() {
  var div = document.getElementById('fd');
  div.style.display = 'inline';
  console.log('adsx')
}

function closeForm() {
  var div = document.getElementById('fd');
  div.style.display = 'none';
  console.log(div.style.display)
}

document.addEventListener('DOMContentLoaded', () => {
  var localStorageData = localStorage.getItem('userData');
  var user;
  try {
    user = JSON.parse(localStorageData);
    console.log('user:', user);
  } catch (error) {
    console.log('Ошибка парсинга JSON:', error);
    return
  }
  var param1Value = user.district;
  var param2Value = user.name;
  var param3Value = user.spec;
  var url = '/getres?district=' + encodeURIComponent(param1Value) + '&name=' + encodeURIComponent(param2Value) + '&spec=' + encodeURIComponent(param3Value);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const parentElement = document.getElementById('infWindow');
      const labels = parentElement.getElementsByClassName('resSchool');
      let totNum = data.countres[0] + data.countres[1] + data.countres[2];
      labels[0].textContent = labels[0].textContent + ' ' + totNum + ' чел.';
      labels[1].textContent = labels[1].textContent + ' ' + data.countres[0] + ' чел.';
      labels[2].textContent = labels[2].textContent + ' ' + data.countres[1] + ' чел.';
      //labels[3].textContent = labels[3].textContent + ' ' + data.countres[2] + ' чел.'; //УБРАТЬ ГРУППА НЕ УКАЗАНА
    })
    .catch(error => {
      console.log(error);
    });
});


document.addEventListener('DOMContentLoaded', function() {
  // Получаем строку с данными из localStorage
  const userDataString = localStorage.getItem('userData');

  // Проверяем, что данные есть
  if (userDataString) {
      // Парсим данные в объект
      const userData = JSON.parse(userDataString);

      // Извлекаем необходимые поля
      const userName = userData.name;

      if (userName) {
          document.getElementById('nameplacer').textContent = userName;
      }
  } else {
      console.log('userData не найден в localStorage');
  }
});