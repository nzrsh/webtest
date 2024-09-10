package handlers

import (
	_ "fmt"
	"net/http"

	"github.com/Rozenkranz/WebTest/database"
	"github.com/Rozenkranz/WebTest/logger"
	"github.com/Rozenkranz/WebTest/utils"
	"github.com/julienschmidt/httprouter"
)

func WelcomeStudent(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/StudentTest/WelcomePage.html")
}

func StudentTest1(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/StudentTest/StudentTest1.html")
}

func StudentTest2(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/StudentTest/StudentTest2.html")
}

func StudentName(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/StudentTest/NamePage.html")
}

func StudentSave(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	user, err := database.ParseUserJSON(r.Body, w)
	if err != nil {
		logger.Logger.Errorln("Ошибка парсинга JSON!")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return

	} else {
		logger.Logger.Infoln(user.District, user.Name, "Отправил данные!")
	}

	err = utils.MakeDirAndXmlStudent(user)

	if err != nil {
		logger.Logger.Errorln("Ошибка формирования XML: ", err)
		w.WriteHeader(http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}
