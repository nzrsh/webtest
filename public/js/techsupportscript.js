document.addEventListener('DOMContentLoaded', function () {
    let schools = [];
    let selectedInstitutionType = null;

    // Функция для загрузки данных
    function loadSchools() {
        fetch('/registration/regme')
            .then(response => response.json())
            .then(data => {
                schools = data;
                populateDistricts(schools);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }

    // Заполняем список районов
    function populateDistricts(schools) {
        const districtSelect = document.getElementById('districtSelect');
        const districts = [...new Set(schools.map(school => school.district))];

        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });

        districtSelect.disabled = false;
    }

    // Функция фильтрации учреждений
    function filterInstitutions() {
        const selectedDistrict = document.getElementById('districtSelect').value;
        const institutionSelect = document.getElementById('institutionSelect');
        institutionSelect.innerHTML = '';

        if (!selectedDistrict || !selectedInstitutionType) {
            return;
        }

        const filteredInstitutions = schools.filter(school => school.district === selectedDistrict && school.spec === selectedInstitutionType);

        if (filteredInstitutions.length === 0) {
            const noOptions = document.createElement('option');
            noOptions.value = "";
            noOptions.textContent = "Нет доступных учреждений";
            institutionSelect.appendChild(noOptions);
        } else {
            filteredInstitutions.forEach(institution => {
                const option = document.createElement('option');
                option.value = institution.name;
                option.textContent = institution.name;
                institutionSelect.appendChild(option);
            });
        }

        institutionSelect.disabled = filteredInstitutions.length === 0;
    }

    // Валидация полей
    function validateForm() {
        const name = document.getElementById('nameInput').value.trim();
        const phone = document.getElementById('phoneInput').value.trim();
        const email = document.getElementById('emailInput').value.trim();
        const message = document.getElementById('messageInput').value.trim();
        const institution = document.getElementById('institutionSelect').value;

        if (!name || !message || !institution) {
            alert('Заполните все обязательные поля: имя, учреждение и сообщение.');
            return false;
        }

        if (!phone && !email) {
            alert('Заполните хотя бы одно поле: телефон или электронную почту.');
            return false;
        }

        return true;
    }

    // Отправка данных
    document.getElementById('feedbackForm').addEventListener('submit', function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = {
            district: document.getElementById('districtSelect').value,
            institutionType: selectedInstitutionType,
            institution: document.getElementById('institutionSelect').value,
            name: document.getElementById('nameInput').value,
            phone: document.getElementById('phoneInput').value,
            email: document.getElementById('emailInput').value,
            message: document.getElementById('messageInput').value,
        };

        console.log('Отправка данных:', formData);

        fetch('/techsupport/sendmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (response.ok) {
                    alert('Сообщение успешно отправлено!');
                    document.getElementById('feedbackForm').reset(); // Очистка формы
                } else {
                    alert('Ошибка при отправке сообщения. Попробуйте позже.');
                }
            })
            .catch(error => {
                console.error('Ошибка при отправке данных:', error);
                alert('Ошибка при отправке сообщения. Попробуйте позже.');
            });
    });

    // Событие при выборе района
    document.getElementById('districtSelect').addEventListener('change', function () {
        document.getElementById('institutionSelect').innerHTML = '';
        document.getElementById('institutionSelect').disabled = true;
        document.getElementById('schoolRadio').disabled = false;
        document.getElementById('spoRadio').disabled = false;
        filterInstitutions();
    });

    // Событие при выборе типа учреждения
    document.querySelectorAll('input[name="institutionType"]').forEach(radio => {
        radio.addEventListener('change', function () {
            selectedInstitutionType = this.value;
            filterInstitutions();
        });
    });

    // Загрузка данных при загрузке страницы
    loadSchools();
});
