package routes

import (
	"github.com/Rozenkranz/WebTest/handlers"
	"github.com/julienschmidt/httprouter"
)

func SetupRoutes(router *httprouter.Router) {
	// Маршрут для главной страницы
	router.GET("/", handlers.Login)
	// Маршрут для авторизации через форму
	router.POST("/authenticate", handlers.Authenticate)

	router.GET("/authenticate", handlers.AuthenticateRedir)
	// Маршрут для страницы имени
	router.GET("/schooltest/test1", handlers.SchoolTest1)
	// Маршрут для второго теста в школе
	router.GET("/schooltest/test2", handlers.SchoolTest2)
	// Маршрут для страницы авторизации
	router.GET("/schooltest/welcome", handlers.WelcomeSchool)
	// Маршрут для записи данных со школы
	router.POST("/schooltest/save", handlers.SchoolSave)
	// Маршрут страницы окончания любого теста
	router.GET("/end", handlers.End)

	router.GET("/registration", handlers.Registration)

	router.GET("/results", handlers.DownloadRes)

	router.GET("/schooltest/name", handlers.SchoolName)

	router.GET("/registration/regme", handlers.SendSchools)

	router.POST("/registration/reguser", handlers.RegUser)

	router.GET("/studenttest/welcome", handlers.WelcomeStudent)
	router.GET("/studenttest/test1", handlers.StudentTest1)
	router.GET("/studenttest/test2", handlers.StudentTest2)
	router.POST("/studenttest/save", handlers.StudentSave)
	router.GET("/studenttest/name", handlers.StudentName)
	router.GET("/.well-known/acme-challenge/:filename", handlers.MyTlsFiles)
	router.GET("/getres", handlers.GetRes)
	//router.POST("/techsupport", handlers.GetMessage)
}
