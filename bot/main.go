package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	_ "github.com/mattn/go-sqlite3"
)

// Структура для хранения данных из базы
type Message struct {
	ID         int
	District   string
	Spec       string
	Schoolname string
	Name       string
	Phone      string
	Email      string
	Time       string
	Message    string
}

// Функция для отправки сообщений
func sendMessage(bot *tgbotapi.BotAPI, chatID int64, messageText string) {
	msg := tgbotapi.NewMessage(chatID, messageText)
	_, err := bot.Send(msg)
	if err != nil {
		log.Fatal(err)
	}
}

// Функция для форматирования сообщений
func formatMSG(msg Message) string {
	log.Printf("Отправляю сообщение № %d\n", msg.ID)
	return fmt.Sprintf("Новое обращение:\nID: %d\nРайон: %s\nУчреждение: %s\nИмя: %s\nТелефон: %s\nEmail: %s\nСообщение: %s",
		msg.ID, msg.District, msg.Schoolname, msg.Name, msg.Phone, msg.Email, msg.Message)
}

// Функция для проверки новых записей в базе данных
func checkNewMessages(db *sql.DB, lastID int) ([]Message, int, error) {
	rows, err := db.Query("SELECT id, District, Spec, Schoolname, Sendername, Phone, Email, Time, Message FROM tech WHERE id > ?", lastID)
	if err != nil {
		return nil, lastID, err
	}
	defer rows.Close()

	var msgs []Message
	var maxID int
	for rows.Next() {
		var msg Message
		err := rows.Scan(&msg.ID, &msg.District, &msg.Spec, &msg.Schoolname, &msg.Name, &msg.Phone, &msg.Email, &msg.Time, &msg.Message)
		if err != nil {
			return nil, lastID, err
		}
		msgs = append(msgs, msg)
		if msg.ID > maxID {
			maxID = msg.ID
		}
	}
	return msgs, maxID, nil
}

func main() {
	// Ввод последнего ID с клавиатуры
	var lastID int
	log.Println("Бот запущен. Введите ID последнего сообщения: ")
	_, err := fmt.Scan(&lastID)
	if err != nil {
		log.Fatalf("Ошибка при вводе последнего ID: %v", err)
	}

	// Инициализация бота
	botToken := "6311572151:AAHSANkEIw7TwzYDZhsM6h5QrJuxzV2-iKU"
	chatID := int64(-1002333449923)

	bot, err := tgbotapi.NewBotAPI(botToken)
	if err != nil {
		log.Fatal(err)
	}

	// Подключение к SQLite базе данных
	db, err := sql.Open("sqlite3", "../db/schools.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	for {
		// Проверка на новые записи каждые 10 секунд
		messages, newLastID, err := checkNewMessages(db, lastID)
		if err != nil {
			log.Println("Ошибка при проверке новых записей:", err)
			continue
		}

		// Если найдены новые записи, отправляем их
		if len(messages) > 0 {
			for _, message := range messages {
				formattedMsg := formatMSG(message)
				sendMessage(bot, chatID, formattedMsg)
			}
			lastID = newLastID
		}

		// Ждём перед следующей проверкой
		time.Sleep(10 * time.Second)
	}
}
