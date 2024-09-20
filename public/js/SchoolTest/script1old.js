let count = 0;
const numberOfQuestions = 28;
const answerArr = new Array(numberOfQuestions).fill(null);

const quest1Arr = [
    'обычно хорошо понимает и учитывает переживания своих друзей (подруг)',
    'легко устанавливает контакт с другими сверстниками',
    'проявляет активность и самостоятельность...',
    // остальные вопросы
];
const quest2Arr = [
    'совершая то или иное действие, в основном учитывает, нравится ли оно ему...',
    'в целом легко ориентируется в изменениях...',
    'при общении со сверстниками ведет себя в соответствии с общепринятыми правилами...',
    // остальные вопросы
];

function updateQuestion() {
    document.getElementById('question-number').innerHTML = `${count + 1}/28. Итак, про отличительные особенности...`;
    document.getElementById('quest1-label').innerHTML = `а) ${quest1Arr[count]}`;
    document.getElementById('quest2-label').innerHTML = `б) ${quest2Arr[count]}`;
}

function increment() {
    const rate2Value = document.querySelector('input[name="rate_2"]:checked');
    const rate3Value = document.querySelector('input[name="rate_3"]:checked');

    if (rate2Value !== null && rate3Value !== null) {
        const rate2ValueChecked = rate2Value.value;
        const rate3ValueChecked = rate3Value.value;

        answerArr[count] = rate3ValueChecked !== '0' ? rate3ValueChecked + rate2ValueChecked : rate3ValueChecked;

        if (count === numberOfQuestions - 2) {
            document.getElementById('baton').innerHTML = 'Перейти к следующему тесту';
        }

        if (count === numberOfQuestions - 1) {
            const userData = localStorage.getItem('userData');
            const user = JSON.parse(userData);
            if (!user) {
                alert('Вы не были авторизованы. Перенаправление на страницу авторизации.');
                window.location.href = '/';
                return;
            }
            localStorage.setItem('result1', answerArr);
            window.location.href = '/schooltest/test2';
            return;
        }

        count++;
        document.querySelector('input[name="rate_2"]:checked').checked = false;
        document.querySelector('input[name="rate_3"]:checked').checked = false;
        updateQuestion();
    } else {
        alert('Пожалуйста, выберите необходимые ответы.');
    }
}

updateQuestion();
