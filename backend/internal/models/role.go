package models

type Role struct {
	Id    string `json:"id" db:"id"`
	Name  string `json:"name" db:"name"`
	Menus []Menu `json:"menus"`
}

type RoleDTO struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}
