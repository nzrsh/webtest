function saveName() {
  if (validateInput()==false)
    {
      return
    }
    // Получение значения поля username
    var username = document.querySelector('input[name="username"]').value;
    var rateValue = document.querySelector('input[name="rate"]:checked');
  
    // Проверка на пустоту поля username
    if (username.trim().length === 0) {
      alert('Пожалуйста, введите имя пользователя!');
      return;
    }

    if (rateValue === null) {
      alert("Выберите группу!");
      return;
    }
  
    // Сохранение имени в localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('group', rateValue.value)
  
    // Перенаправление пользователя на следующую страницу
    window.location.href = '/schooltest/test1'; // Замените на URL следующей страницы

    document.addEventListener("DOMContentLoaded", function() {
      if (!navigator.onLine) {
        alert("Ваше интернет соединение отсутствует или нестабильно, дальнейшее прохождение тестирование невозможно.")
      }
    });
  }

  function validateInput() {
    // Получаем значение из textarea
    let inputField = document.getElementById('input_area');
    let inputValue = inputField.value;

    // Регулярное выражение для проверки латиницы и цифр
    let regex = /^[а-яА-ЯёЁ0-9\s]+$/;

    // Проверяем, если есть что-то кроме латиницы и цифр
    if (!regex.test(inputValue)) {
        // Очищаем поле и выводим предупреждение
        inputField.value = '';
        alert("В поле ввода разрешены только кириллические буквы и цифры!");
        return false
    } else {
      return true
    }
}