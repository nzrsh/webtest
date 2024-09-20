package handlers

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Login обрабатывает запрос на вход и отдает страницу login.html.
func Login(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/LoginPage.html")
}

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

// End отдает страницу EndPage.html.
func End(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/EndPage.html")
}

func Registration(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.ServeFile(w, r, "public/html/RegPage.html")
}

func AuthenticateRedir(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	http.Redirect(w, r, "/", http.StatusFound)
}
