package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/Rozenkranz/WebTest/database"
	"github.com/Rozenkranz/WebTest/logger"
	"github.com/Rozenkranz/WebTest/utils"
	"github.com/julienschmidt/httprouter"
)

// SchoolTest1 отдает страницу SchoolTest1.html.
func SchoolTest1(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/SchoolTest/SchoolTest1.html")
}

// SchoolTest2 отдает страницу SchoolTest2.html.
func SchoolTest2(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/SchoolTest/SchoolTest2.html")
}

// Welcome отдает страницу WelcomePage.html.
func WelcomeSchool(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/SchoolTest/WelcomePage.html")
}

func SchoolName(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/SchoolTest/NamePage.html")
}

// SchoolSave получает данные от пользователя и сохраняет их.
func SchoolSave(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	user, err := database.ParseUserJSON(r.Body, w)
	if err != nil {
		logger.Logger.Errorln("Ошибка парсинга JSON!")
		http.Error(w, err.Error(), http.StatusBadRequest)
		return

	} else {
		logger.Logger.Infoln(user.District, user.Name, "Отправил данные!")
	}

	err = database.InputResultsInDB(user)
	if err != nil {
		logger.Logger.Errorln(err)
		return
	}

	err = utils.MakeDirAndXmlChild(user)

	if err != nil {
		logger.Logger.Errorln("Ошибка формирования XML: ", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func GetRes(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	district := r.URL.Query().Get("district")
	name := r.URL.Query().Get("name")
	spec := r.URL.Query().Get("spec")

	res := []int{0, 0, 0}

	var path string

	if spec == "child" {
		path = "./Ответы/Школы/Школьники/" + district + "/" + name
	}
	if spec == "student" {
		path = "./Ответы/Колледжи/Студенты/" + district + "/" + name
	}

	err := filepath.Walk(path, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && filepath.Ext(path) == ".xml" {
			res[2]++
		}
		return nil
	})
	if err != nil {
		//logger.Logger.Error("Ошибка при обходе директории:", district, name, spec, err)
		res[2] = 0
	}

	err = filepath.Walk(path+"/А/", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && filepath.Ext(path) == ".xml" {
			res[0]++
		}
		return nil
	})
	if err != nil {
		//logger.Logger.Error("Ошибка при обходе директории:", district, name, spec, err)
		res[0] = 0
	}

	err = filepath.Walk(path+"/Б/", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && filepath.Ext(path) == ".xml" {
			res[1]++
		}
		return nil
	})
	if err != nil {
		//logger.Logger.Error("Ошибка при обходе директории:", district, name, spec, err)
		res[1] = 0
	}
	res[2] = res[2] - (res[0] + res[1])
	//logger.Logger.Infoln(district, name, "Посмотрели количество прошедших: ", res)
	var results database.Res
	results.CountRes = res
	jsonData, err := json.Marshal(results)
	if err != nil {
		logger.Logger.Errorln("ошибка при маршализировании результатов: ", err)
	}
	w.Write([]byte(jsonData))

}
