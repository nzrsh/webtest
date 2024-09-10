package database

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/Rozenkranz/WebTest/logger"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() error {
	// Инициализация и подключение к базе данных
	db, err := sql.Open("sqlite3", "db/schools.db")
	if err != nil {
		logger.Logger.Errorln("БД не смогла открыться...", err)
		return err
	}
	DB = db
	return nil
}

func CheckUser(login, password string) ([]byte, string, SchoolUser) {
	var user SchoolUser
	// Проверка наличия соединения с базой данных
	if DB == nil {
		logger.Logger.Errorln("Соединение с базой данных не установлено")
		return []byte(nil), "nil", user
	}

	// Выполнение запроса к базе данных для проверки пользователя
	query := "SELECT * FROM schools WHERE login = ? AND password = ?"

	err := DB.QueryRow(query, login, password).Scan(&user.ID, &user.District, &user.Name, &user.Password, &user.Login, &user.Spec)
	user.Password = "hashed"
	user.Username = "empty"
	user.Organization = "empty"
	if err != nil {
		return []byte(nil), "nil", user
	}
	userJSON, err := json.Marshal(user)
	if err != nil {
		return []byte(nil), "nil", user
	}
	return userJSON, user.Spec, user
}

func ParseUserJSON(jsonData io.ReadCloser, w http.ResponseWriter) (schooluser SchoolUser, err error) {
	var user SchoolUser
	err = json.NewDecoder(jsonData).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return SchoolUser{}, err
	}
	return user, nil
}

func TakeSchoolsFromBD() ([]School, error) {
	var Schools []School
	// Проверка наличия соединения с базой данных
	if DB == nil {
		logger.Logger.Fatalln("Соединение с базой данных не установлено")
	}

	rows, err := DB.Query("SELECT id, district, name, spec FROM schools")
	if err != nil {
		logger.Logger.Errorln("Ошибка при считывании строк для списка", err)
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var school School
		err := rows.Scan(&school.ID, &school.District, &school.Name, &school.Spec)
		if err != nil {
			logger.Logger.Errorln("Ошибка чтения школ: ", err)
		}
		Schools = append(Schools, school)
		if err := rows.Err(); err != nil {
			logger.Logger.Errorln("Ошибка при выполнении запроса: ", err)
			return nil, err
		}
	}
	return Schools, nil
}

func RegisterUser(newUser User) error {
	var existingPassword string
	err := DB.QueryRow("SELECT password FROM schools WHERE district = ? AND name = ?", newUser.District, newUser.Name).Scan(&existingPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			_, err = DB.Exec("INSERT INTO schools (district, name, password, login, spec) VALUES (?, ?, ?, ?, ?)", newUser.District, newUser.Name, newUser.Password, newUser.Login, newUser.Spec)
			if err != nil {
				logger.Logger.Errorln(err)
				return err
			}
			logger.Logger.Infoln("Пользователь ", newUser.Name, " добавлен успешно")
			return nil
		} else {
			logger.Logger.Errorln(err)
			return err
		}
	}

	if existingPassword == "empty" {
		_, err = DB.Exec("UPDATE schools SET login = ?, password = ? WHERE district = ? AND name = ?", newUser.Login, newUser.Password, newUser.District, newUser.Name)
		if err != nil {
			logger.Logger.Errorln(err)
			err = fmt.Errorf("Логин \"%s\" уже занят!", newUser.Login)
			return err
		}
		logger.Logger.Infoln("Логин и пароль пользователя ", newUser.Name, " обновлены успешно")
		return nil
	}

	logger.Logger.Errorln("Пользователь ", newUser.Name, " уже зарегистрирован")
	return fmt.Errorf("Пользователь %s уже зарегистрирован!", newUser.Name)
}
