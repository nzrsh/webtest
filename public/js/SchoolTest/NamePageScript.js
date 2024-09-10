function saveName() {
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