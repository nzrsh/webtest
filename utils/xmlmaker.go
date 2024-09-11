package utils

import (
	"bufio"
	"encoding/hex"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"time"

	"github.com/Rozenkranz/WebTest/database"
	"github.com/Rozenkranz/WebTest/logger"
)

const (
	SchoolPath  = "./Ответы/Школы/Школьники/"
	StudentPath = "./Ответы/Колледжи/Студенты/"
)

func MakeDirAndXmlChild(user database.SchoolUser) error {
	err := makeDir(SchoolPath + user.District)
	if err != nil {
		return err
	}

	var path string
	if user.Group == "a" {
		path = SchoolPath + user.District + "/" + user.Name + "/" + "А"
	} else {
		path = SchoolPath + user.District + "/" + user.Name + "/" + "Б"
	}
	err = makeDir(path)
	if err != nil {
		return err
	}

	filePath := filepath.Join(path, user.Username+"_"+generateUniqueFileName(10)+".xml")
	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	err = fillXmlChild(user, file)
	if err != nil {
		return err
	}
	logger.Logger.Infoln(user.ID, user.District, user.Name, user.Username, user.Group, "Данные пользователя сформированы успешно")
	return nil
}

func makeDir(path string) error {
	err := os.MkdirAll(path, 0755)
	if err != nil {
		return err
	}
	return nil
}

func generateUniqueFileName(length int) string {
	randomBytes := make([]byte, length)
	rand.Seed(time.Now().UnixNano())
	rand.Read(randomBytes)
	randomName := hex.EncodeToString(randomBytes)
	currentTime := time.Now().Format("20060102150405")
	fileName := fmt.Sprintf("%s_%s", currentTime, randomName)
	return fileName
}

func fillXmlChild(user database.SchoolUser, file *os.File) error {
	writer := bufio.NewWriter(file)
	defer writer.Flush()

	xmlContent := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<persons>
	<person>
		<position>Учащийся (Старшая школа) - 11 класс 4 четверть</position>
		<organization>%s</organization>
		<artifacts>
			<artifact code="OVRP">`, user.Name)

	_, err := writer.WriteString(xmlContent)
	if err != nil {
		return err
	}

	for i := 0; i < len(user.Result1); i++ {
		_, err = writer.WriteString(fmt.Sprintf(`<answer number="%d">%s</answer>`, i+1, user.Result1[i]))
		if err != nil {
			return err
		}
	}

	_, err = writer.WriteString(`</artifact>
			<artifact code="Test39">`)
	if err != nil {
		return err
	}

	for i := 0; i < len(user.Result2); i++ {
		_, err = writer.WriteString(fmt.Sprintf(`<answer number="%d">%s</answer>`, i+1, user.Result2[i]))
		if err != nil {
			return err
		}
	}

	_, err = writer.WriteString(`</artifact>
		</artifacts>
	</person>
</persons>`)
	if err != nil {
		return err
	}

	return nil
}

func MakeDirAndXmlStudent(user database.SchoolUser) error {
	err := makeDir(StudentPath + user.District)
	if err != nil {
		return err
	}

	var path string
	if user.Group == "a" {
		path = StudentPath + user.District + "/" + user.Name + "/" + "А"
	} else {
		path = StudentPath + user.District + "/" + user.Name + "/" + "Б"
	}
	err = makeDir(path)
	if err != nil {
		return err
	}

	filePath := filepath.Join(path, user.Username+".xml")
	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	err = fillXmlStudent(user, file)
	if err != nil {
		return err
	}

	logger.Logger.Infoln(user.ID, user.District, user.Name, user.Username, user.Group, "Данные пользователя сформированы успешно")
	return nil
}

func fillXmlStudent(user database.SchoolUser, file *os.File) error {
	writer := bufio.NewWriter(file)
	defer writer.Flush()

	xmlContent := fmt.Sprintf(`<?xml version="1.0" encoding="UTF-8"?>
<persons>
	<person>
		<position>Учащийся (Старшая школа) - 11 класс 4 четверть</position>
		<organization>%s</organization>
		<name>%s</name>
		<artifacts>
			<artifact code="OVRP">`, user.Organization, user.Username)

	_, err := writer.WriteString(xmlContent)
	if err != nil {
		return err
	}

	for i := 0; i < len(user.Result1); i++ {
		_, err = writer.WriteString(fmt.Sprintf(`<answer number="%d">%s</answer>`, i+1, user.Result1[i]))
		if err != nil {
			return err
		}
	}

	_, err = writer.WriteString(`</artifact>
			<artifact code="Test39">`)
	if err != nil {
		return err
	}

	for i := 0; i < len(user.Result2); i++ {
		_, err = writer.WriteString(fmt.Sprintf(`<answer number="%d">%s</answer>`, i+1, user.Result2[i]))
		if err != nil {
			return err
		}
	}

	_, err = writer.WriteString(`</artifact>
		</artifacts>
	</person>
</persons>`)
	if err != nil {
		return err
	}

	return nil
}
