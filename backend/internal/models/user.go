package models

type User struct {
	Id       string `json:"id" db:"id"`
	UserName string `json:"userName" db:"user_name"`
	Sector   string `json:"sector"`
	Role     string `json:"role" db:"role"`
	MenuApi  []Menu `json:"-"`
	Menu     []Menu `json:"menu"`
}

type UserShort struct {
	Id       string `db:"id"`
	UserName string `db:"user_name"`
	Role     string `db:"role"`
}

type UserDTO struct {
	Id           string `json:"id"`
	UserName     string `json:"userName"`
	Password     string `json:"password"`
	Sector       string `json:"sector"`
	RoleId       string `json:"role_id"`
	IsShowInList bool   `json:"isShowInList"`
	IsDisabled   bool   `json:"isDisabled"`
}
