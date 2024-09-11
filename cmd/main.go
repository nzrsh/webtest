package main

import (
	"crypto/tls"
	"net/http"

	"github.com/Rozenkranz/WebTest/database"
	"github.com/Rozenkranz/WebTest/logger"
	"github.com/Rozenkranz/WebTest/routes"
	"github.com/julienschmidt/httprouter"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	logger := logger.InitLogger()
	logger.Println("Логгер событий подключен")

	err := database.InitDB()
	if err != nil {
		logger.Fatalln(err)
	}

	router := httprouter.New()
	router.ServeFiles("/public/*filepath", http.Dir("./public"))
	routes.SetupRoutes(router)

	//http.ListenAndServe(":8080", router)

	go func() {
		logger.Info("Запускаю HTTP сервер сертификации...")
		err = http.ListenAndServe(":8080", router)
		if err != nil {
			logger.Fatalln("Ошибка: ", err)
		}
	}()

	//Начало HTTPS

	go func() {
		logger.Info("Запускаю HTTP сервер для перенаправления на HTTPS...")
		err := http.ListenAndServe(":80", http.HandlerFunc(redirectToHTTPS))
		if err != nil {
			logger.Fatal(err)
		}
	}()

	logger.Info("Запускаю HTTPS сервер...")
	certFile := "/etc/letsencrypt/live/attest.edu-penza.ru/fullchain.pem"
	keyFile := "/etc/letsencrypt/live/attest.edu-penza.ru/privkey.pem"
	logger.Infoln("Абсолютный путь к файлу сертификата:", certFile)
	logger.Infoln("Абсолютный путь к файлу закрытого ключа:", keyFile)

	tlsConfig := &tls.Config{
		MinVersion: tls.VersionTLS12,
	}

	cert, err := tls.LoadX509KeyPair(certFile, keyFile)
	if err != nil {
		logger.Fatal(err)
	}

	tlsConfig.Certificates = []tls.Certificate{cert}

	server := &http.Server{
		Addr:      ":443",
		TLSConfig: tlsConfig,
		Handler:   router,
	}

	err = server.ListenAndServeTLS("", "")
	if err != nil {
		logger.Fatal(err)
	}
}
func redirectToHTTPS(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, "https://"+r.Host+r.RequestURI, http.StatusMovedPermanently)
}

//Это HTTP
