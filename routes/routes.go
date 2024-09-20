package routes

import (
	"github.com/Rozenkranz/WebTest/handlers"
	"github.com/julienschmidt/httprouter"
)

func SetupRoutes(router *httprouter.Router) {

	// API
	router.POST("/schooltest/save", handlers.SchoolSave)

	router.POST("/authenticate", handlers.Authenticate)

	router.GET("/authenticate", handlers.AuthenticateRedir)

	router.GET("/results", handlers.DownloadRes)

	router.GET("/registration/regme", handlers.SendSchools)

	router.POST("/registration/reguser", handlers.RegUser)

	router.POST("/techsupport/sendmessage", handlers.GetMessage)

	router.GET("/getres", handlers.GetRes)

	router.POST("/studenttest/save", handlers.StudentSave)

	router.GET("/.well-known/acme-challenge/:filename", handlers.MyTlsFiles)
	// API

	// HTML
	router.GET("/", handlers.Login)

	router.GET("/techsupport", handlers.TechSupport)

	router.GET("/registration", handlers.Registration)

	router.GET("/schooltest/welcome", handlers.WelcomeSchool)

	router.GET("/schooltest/name", handlers.SchoolName)

	router.GET("/schooltest/test1", handlers.SchoolTest1)

	router.GET("/schooltest/test2", handlers.SchoolTest2)

	router.GET("/studenttest/welcome", handlers.WelcomeStudent)

	router.GET("/studenttest/name", handlers.StudentName)

	router.GET("/studenttest/test1", handlers.StudentTest1)

	router.GET("/studenttest/test2", handlers.StudentTest2)

	router.GET("/end", handlers.End)
	// HTML
}
