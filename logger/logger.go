package logger

import (
	"fmt"
	"io"
	"os"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
)

var Logger *logrus.Logger

type CustomFormatter struct{}

func (f *CustomFormatter) Format(entry *logrus.Entry) ([]byte, error) {
	currentTime := time.Now()
	time := currentTime.Format("02/01/2006 15:04:05")
	level := strings.ToUpper(entry.Level.String())
	message := entry.Message

	// Форматируем запись лога по вашему желанию
	msg := fmt.Sprintf("[%s] [%s] %s\n", time, level, message)

	return []byte(msg), nil
}

// InitLogger инициализирует логгер Logrus
func InitLogger() *logrus.Logger {
	if Logger != nil {
		return Logger
	}

	Logger = logrus.New()

	// Настройка вывода логов в файл
	file, err := os.OpenFile("./logs/logfile.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err == nil {
		// Создание мультиписателя (multiwriter) для вывода в файл и в консоль
		mw := io.MultiWriter(file, os.Stdout)
		Logger.SetOutput(mw)
	} else {
		Logger.Info("Не удалось открыть файл логов, используется только стандартный вывод")
	}

	// Настройка формата логов
	Logger.SetFormatter(&logrus.TextFormatter{
		FullTimestamp:   true,
		TimestampFormat: "2006-01-02 15:04:05",
	})

	Logger.SetFormatter(&CustomFormatter{})
	return Logger
}
