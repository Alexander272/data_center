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

type RoleWithApi struct {
	Id     string `json:"id" db:"id"`
	Name   string `json:"name" db:"name"`
	Path   string `json:"path" db:"path"`
	Method string `json:"method" db:"method"`
}
