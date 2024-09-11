package database

type SchoolUser struct {
	ID           int      `json:"id"`
	District     string   `json:"district"`
	Name         string   `json:"name"`
	Password     string   `json:"password"`
	Login        string   `json:"login"`
	Username     string   `json:"username"`
	Spec         string   `json:"spec"`
	Organization string   `json:"organization"`
	Result1      []string `json:"result1"`
	Result2      []string `json:"result2"`
	Group        string   `json:"group"`
}

type User struct {
	District string `json:"district"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Login    string `json:"login"`
	Spec     string `json:"spec"`
}

type School struct {
	ID       int    `json:"id"`
	District string `json:"district"`
	Name     string `json:"name"`
	Spec     string `json:"spec"`
}

type Res struct {
	CountRes []int `json:"countres"`
}

type Feedback struct {
	District   string `json:"district"`
	Spec       string `json:"institutionType"`
	Schoolname string `json:"institution"`
	Name       string `json:"name"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
	Message    string `json:"message"`
}
