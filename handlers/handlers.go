package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/Rozenkranz/WebTest/bot"
	"github.com/Rozenkranz/WebTest/database"
	"github.com/Rozenkranz/WebTest/logger"
	"github.com/julienschmidt/httprouter"
)

// Login обрабатывает запрос на вход и отдает страницу login.html.
func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/LoginPage.html")
}

// End отдает страницу EndPage.html.
func End(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/EndPage.html")
}

// Authenticate обрабатывает запрос на авторизацию и перенаправляет на страницу /schooltest1.
func Authenticate(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	err := r.ParseForm()
	if err != nil {
		http.Error(w, "Ошибка сервера", http.StatusInternalServerError)
		return
	}

	login := r.Form.Get("login")
	password := r.Form.Get("password")

	if login == "" || password == "" {
		http.Error(w, "Неверные данные", http.StatusBadRequest)
		return
	}

	userJSON, spec, user := database.CheckUser(login, password)

	if len(userJSON) == 0 {
		http.Error(w, "Ошибка аутентификации. Неверный логин или пароль.", http.StatusUnauthorized)
		return
	} else {
		logger.Logger.Infoln("В систему зашёл пользователь: ", user.ID, user.District, user.Name)
		if spec == "child" {

			fmt.Fprintf(w, `<script>window.onload = function() { localStorage.setItem('userData', '%s'); window.location.href = '/schooltest/welcome'; }</script>`, userJSON)
		}

		if spec == "student" {
			fmt.Fprintf(w, `<script>window.onload = function() { localStorage.setItem('userData', '%s'); window.location.href = '/studenttest/welcome'; }</script>`, userJSON)
		}

		if spec == "teacher" {
			fmt.Fprintf(w, `<script>window.onload = function() { localStorage.setItem('userData', '%s'); window.location.href = '/techertest/welcome'; }</script>`, userJSON)
		}
	}
}

func DownloadRes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	district := r.URL.Query().Get("district")
	name := r.URL.Query().Get("name")
	spec := r.URL.Query().Get("spec")

	var path string

	if spec == "child" {
		path = "./Ответы/Школы/Школьники/" + district + "/" + name + "/1.zip"
	}
	if spec == "student" {
		path = "./Ответы/Колледжи/Студенты/" + district + "/" + name + "/1.zip"
	}

	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		logger.Logger.Errorln("Не получил результаты", district, name, spec, "Ошибка:", err)
		http.Error(w, "Результаты ещё не сформированы", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=Результаты.zip")
	w.Header().Set("Content-Type", "application/zip")

	file, err := os.Open(path)
	if err != nil {
		logger.Logger.Errorln("Нет результатов у ", district, name, spec, "Ошибка:", err)
		http.Error(w, "Результаты ещё не сформированы", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	_, err = io.Copy(w, file)
	if err != nil {
		logger.Logger.Infoln("Нет результатов у ", district, name, spec, "Ошибка:", err)
		http.Error(w, "Результаты ещё не сформированы", http.StatusInternalServerError)
		return
	}
	logger.Logger.Infoln("Получил результаты", district, name, "успешно")
}

func MyTlsFiles(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
	logger.Logger.Infoln("Получил запрос на сервер для подключения к серверу ТЗ")
	filename := p.ByName("filename")
	path := "public/.well-known/acme-challenge/" + filename
	http.ServeFile(w, r, path)

}

func Registration(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/RegPage.html")
}

func SendSchools(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	schools, err := database.TakeSchoolsFromBD()
	if err != nil {
		http.Error(w, "Ошибка с получением списка школ", http.StatusInternalServerError)
		logger.Logger.Errorln("Ошибка с получением списка школ")
		return
	}

	schoolsJSON, err := json.Marshal(schools)
	if err != nil {
		http.Error(w, "Ошибка с получением списка школ", http.StatusInternalServerError)
		logger.Logger.Errorln("Ошибка с кодированием списка школ")
	}
	w.Header().Set("Content-Type", "application/json")

	w.Write(schoolsJSON)

}

func Signup(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

}

func AuthenticateRedir(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.Redirect(w, r, "/", http.StatusFound)
}

func RegUser(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var newUser database.User

	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	err = database.RegisterUser(newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func TechSupport(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/TechPage.html")
}

func GetMessage(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	var feedback database.Feedback
	err := json.NewDecoder(r.Body).Decode(&feedback)
	if err != nil {
		http.Error(w, "Ошибка при парсинге JSON", http.StatusBadRequest)
		logger.Logger.Printf("Ошибка при парсинге JSON сообщения: %v\n", err)
		return
	}
	bot.FormatMSG(feedback)
	logger.Logger.Printf("%s %s отправил новое сообщение!", feedback.District, feedback.Schoolname)
	err = database.PutFeedbackInDb(feedback)
	if err != nil {
		http.Error(w, "Ошибка при записи данных в базу", http.StatusInternalServerError)
		logger.Logger.Errorf("Ошибка при записи данных в базу данных: %v\n", err)
		return
	}

	w.WriteHeader(http.StatusOK)
}
