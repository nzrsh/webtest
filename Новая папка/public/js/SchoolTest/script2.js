// Инициализируем необходимые переменные
let count = 0;
const numberOfQuestions = 39;
const answerArr = new Array(numberOfQuestions).fill(null);

// Массив вопросов
var quest3Arr = ['Обычно у меня бывает сразу несколько увлечений, долгое время увлекаться чем-либо одним мне не свойственно.', 'Думаю, мне бы понравилась работа, связанная с административно-хозяйственной деятельностью.', 'Мне очень трудно бывает расставаться с какой-либо мыслью, в которую я когда-то поверил, хотя появилось много убедительных доводов против нее.',
  'В туристическом путешествии я предпочел бы придерживаться программы, составленной специалистами, нежели самому планировать свой маршрут.', 'Если моим замыслам мешают только люди, а не объективные обстоятельства, я предпочитаю действовать в соответствии с этими замыслами.',
  'Обычно дело, за которое я взялся, мне трудно отложить даже ненадолго.', 'Я быстро осваиваюсь в новой обстановке, включаюсь в новое для себя дело.', 'Я считаю, что в интересах дела люди на выборных должностях должны сменяться регулярно.',
  'Я испытываю смущение, если мое мнение о прочитанной книге или о просмотренном фильме разошлось с общепринятым.', 'Люди, которые старше меня, чаще всего правы, так как у них больше опыта.', 'В воспитании важнее окружить ребенка теплотой и заботой, нежели выработать у него желательные навыки и взгляды.',
  'Когда требуется принять быстрое ответственное решение, я испытываю трудности из-за того, что не могу собраться с мыслями.', 'Временами я собой восхищаюсь.', 'Я люблю сказки Г.Х. Андерсена.', 'Я буду беспокоиться, если кто-то подумает, что я отклоняюсь от правил, принятых в кругу наших знакомых.',
  'Обычно я засыпаю спокойно, и меня не тревожат никакие мысли.', 'Когда мне становится скучно, я стараюсь что-нибудь предпринять, чтобы встряхнуться.', 'Если бы мне дали такую возможность, я бы мог успешно руководить людьми.',
  'Мне бы понравилось работать личным секретарем, помощником, референтом, например, у какого-нибудь директора.', 'Новый учебный материал я обычно запоминаю и усваиваю очень быстро, хотя иногда способен также быстро его забывать.', 'Если я вижу дерущихся детей, то, как правило, стараюсь прекратить драку.',
  'Если бы люди не были зачастую настроены против меня, я достиг бы гораздо большего.', 'Обычно люди тратят слишком много своего времени на выполнение обязанностей перед родственниками и помощь по дому.', 'Иногда я говорю неправду.',
  'Я считаю, что непринужденность поведения важнее, чем соблюдение правил хорошего тона.', 'У меня так случалось, что я что-то делал, а потом не помнил, что именно я делал.', 'Занимаясь каким-нибудь делом, гораздо важнее пользоваться расположением нужных людей, чем стараться добиться результата первоклассным исполнением.',
  'Бывает, что я сержусь.', 'Думая о трудностях в предстоящем деле, я стараюсь планировать их заранее.', 'Всё мне кажется одинаковым на вкус.', 'Мне нравится строить планы заранее, чтобы не терять времени даром.', 'В гостях я держусь за столом лучше, чем дома.',
  'Когда я что-либо делаю, самое главное для меня - чтобы это не повредило моим товарищам.', 'В моей жизни был один или несколько случаев, когда я чувствовал, что кто-то посредством гипноза заставляет меня совершать те или иные поступки.',
  'В своих поступках я всегда стараюсь придерживаться общепринятых правил поведения.', 'Бывает, что я откладываю на завтра то, что нужно сделать сегодня.', 'Я довольно требовательный человек и нередко настаиваю, чтобы всё делалось правильно.',
  'Считаю, что с памятью у меня всё в полном порядке.', 'Мне нравится работа, требующая прежде всего добросовестности, точных навыков и умений.'];

// Обновляем текст вопроса
function updateQuestion() {
    const questionText = document.getElementById('question-text');
    questionText.textContent = `${count + 1}/39. ${quest3Arr[count]}`;
}

// Добавляем обработчик события для кнопки "Далее"
document.getElementById('baton').addEventListener('click', function () {
    const rateValue = document.querySelector('input[name="rate"]:checked');
    
    if (rateValue !== null) {
        // Сохраняем выбранный ответ
        answerArr[count] = rateValue.value;
        document.querySelector('input[name="rate"]:checked').checked = false;

        // Обновляем состояние кнопки на "Завершить", если последний вопрос
        if (count === numberOfQuestions - 2) {
            document.getElementById('baton').innerText = 'Завершить';
        }

        // Проверяем, если это последний вопрос
        if (count === numberOfQuestions - 1) {
            localStorage.setItem('result2', answerArr);
            sendJSONToServer('/schooltest/save');
            return;
        }

        // Увеличиваем счетчик вопросов
        count++;
        updateQuestion();
    } else {
        alert("Пожалуйста, выберите необходимую опцию.");
    }
});

// Функция для отправки данных на сервер
function sendJSONToServer(url) {
    const button = document.getElementById('baton');
    button.disabled = true;
    const localStorageData = localStorage.getItem('userData');

    let user;
    try {
        user = JSON.parse(localStorageData);
    } catch (error) {
        console.error('Ошибка парсинга JSON:', error);
        return;
    }

    if (!user) {
        alert("Вы не авторизованы.");
        window.location.href = '/';
        return;
    }

    const results1 = localStorage.getItem('result1');
    if (!results1) {
        alert("Первая часть теста не пройдена.");
        window.location.href = '/';
        return;
    }

    const userData = {
        id: user.id,
        district: user.district,
        name: user.name,
        password: 'hashed',
        login: user.login,
        username: localStorage.getItem('username'),
        organization: "empty",
        result1: results1.split(','),
        result2: answerArr,
        group: localStorage.getItem('group')
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            localStorage.clear();
            window.location.pathname = "/end";
        } else {
            alert("Ошибка отправки данных.");
        }
        button.disabled = false;
    };
    xhr.onerror = function () {
        alert("Ошибка соединения.");
        button.disabled = false;
    };

    xhr.ontimeout = function () {
        alert("Время ожидания истекло. Сервер не отвечает.");
        button.disabled = false;
    };
    xhr.send(JSON.stringify(userData));
}

// Инициализация первого вопроса
updateQuestion();
