function saveName() {
  if (!validateInput()){
    return;
  }
    // Получение значения поля username
    var username = document.querySelector('input[name="username"]').value;
    var organization = document.querySelector('input[name="organization"]').value;
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
    localStorage.setItem('organization', organization)
    localStorage.setItem('group',rateValue.value)
  
    // Перенаправление пользователя на следующую страницу
    window.location.href = '/studenttest/test1'; // Замените на URL следующей страницы

    document.addEventListener("DOMContentLoaded", function() {
      if (!navigator.onLine) {
        alert("Ваше интернет соединение отсутствует или нестабильно, дальнейшее прохождение тестирование невозможно.")
      }
    });
  }

  function validateInput() {
    // Получаем значение из textarea
    let inputField1 = document.getElementById('input_area1');
    let inputField2 = document.getElementById('input_area2');
    let inputValue1 = inputField1.value;
    let inputValue2 = inputField2.value;

    // Регулярное выражение для проверки латиницы и цифр
    let regex = /^[a-zA-Z0-9\s]+$/;

    // Проверяем, если есть что-то кроме латиницы и цифр
    if (!regex.test(inputValue1) || !regex.test(inputValue2)) {
        // Очищаем поле и выводим предупреждение
        inputField1.value = '';
        inputField2.value = '';
        alert("В поле ввода разрешены только латинские буквы и цифры!");
        return false
    } 
    return true
}