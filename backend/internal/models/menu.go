package models

type Menu struct {
	Id     string `json:"id" db:"id"`
	Name   string `json:"name" db:"name"`
	Type   string `json:"type" db:"type"`
	Path   string `json:"path" db:"path"`
	Method string `json:"method" db:"method"`
	IsShow bool   `json:"isShow" db:"is_show"`
}

type MenuDTO struct {
	Id     string `json:"id" db:"id"`
	RoleId string `json:"roleId" db:"role_id"`
	Name   string `json:"name" db:"name"`
	Type   string `json:"type" db:"type"`
	Path   string `json:"path" db:"path"`
	Method string `json:"method" db:"method"`
	IsShow bool   `json:"isShow" db:"is_show"`
}
