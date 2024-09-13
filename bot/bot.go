package bot

import (
	"fmt"
	"log"

	"github.com/Rozenkranz/WebTest/database"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
)

func sendMessage(messageText string) {
	// Токен вашего бота
	botToken := "6311572151:AAHSANkEIw7TwzYDZhsM6h5QrJuxzV2-iKU" // ID чата, куда нужно отправить сообщение
	chatID := int64(-4558849277)
	// Создание нового бота
	bot, err := tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Fatal(err)
	}

	// Создание нового сообщения

	msg := tgbotapi.NewMessage(chatID, messageText)
	// Отправка сообщения
	_, err = bot.Send(msg)
	if err != nil {
		log.Fatal(err)
	}
}

func FormatMSG(f database.Feedback) {
	msg := fmt.Sprintf("Новое сообщение: \nРайон: %s\nУчреждение: %s\nОтправитель: %s\nТелефон: %s\nПочта: %s\nСообщение: %s\n\n", f.District, f.Schoolname, f.Name, f.Phone, f.Email, f.Message)
	sendMessage(msg)
}
