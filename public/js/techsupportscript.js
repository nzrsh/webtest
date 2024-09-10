document.addEventListener("DOMContentLoaded", function () {
    let districtSelect = document.getElementById('districtSelect');
    let institutionSelect = document.getElementById('institutionSelect');
    let institutionTypeRadios = document.querySelectorAll('input[name="institutionType"]');
    let schools = []; // Будет хранить данные школ и СПО

    // Запрос данных о школах/СПО
    fetch('/registration/regme')
        .then(response => response.json())
        .then(data => {
            schools = data;
            populateDistricts(schools);
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
        });

    // Заполняем список районов
    function populateDistricts(schools) {
        let districts = [...new Set(schools.map(school => school.district))];
        districts.forEach(district => {
            let option = document.createElement('option');
            option.value = district;
            option.text = district;
            districtSelect.appendChild(option);
        });
    }

    // Активируем выбор учреждений после выбора района и типа
    districtSelect.addEventListener('change', enableInstitutionSelect);
    institutionTypeRadios.forEach(radio => radio.addEventListener('change', enableInstitutionSelect));

    function enableInstitutionSelect() {
        let selectedDistrict = districtSelect.value;
        let selectedInstitutionType = document.querySelector('input[name="institutionType"]:checked')?.value;

        if (selectedDistrict && selectedInstitutionType) {
            populateInstitutions(selectedDistrict, selectedInstitutionType);
            institutionSelect.disabled = false;
        }
    }

    // Заполняем список школ/СПО в зависимости от района и типа
    function populateInstitutions(district, institutionType) {
        institutionSelect.innerHTML = '<option value="" selected disabled>Выберите учреждение</option>';
        schools
            .filter(school => school.district === district && school.type === institutionType)
            .forEach(school => {
                let option = document.createElement('option');
                option.value = school.name;
                option.text = school.name;
                institutionSelect.appendChild(option);
            });
    }

    // Проверка перед отправкой формы
    document.getElementById('feedbackForm').addEventListener('submit', function (e) {
        e.preventDefault();

        let name = document.getElementById('nameInput').value;
        let phone = document.getElementById('phoneInput').value;
        let email = document.getElementById('emailInput').value;
        let message = document.getElementById('messageInput').value;

        if (!phone && !email) {
            alert('Пожалуйста, укажите либо телефон, либо почту.');
            return;
        }

        let formData = {
            district: districtSelect.value,
            institution: institutionSelect.value,
            name: name,
            phone: phone,
            email: email,
            message: message
        };

        fetch('/feedback/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (response.ok) {
                    alert('Сообщение успешно отправлено!');
                    location.reload();
                } else {
                    throw new Error('Ошибка при отправке сообщения');
                }
            })
            .catch(error => {
                alert('Ошибка при отправке сообщения: ' + error.message);
            });
    });
});