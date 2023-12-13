package models

// type Menu struct {
// 	Id          string `json:"id" db:"id"`
// 	Name        string `json:"name" db:"name"`
// 	Type        string `json:"-" db:"type"`
// 	Path        string `json:"path" db:"path"`
// 	Method      string `json:"-" db:"method"`
// 	IsShow      bool   `json:"-" db:"is_show"`
// 	Description string `json:"-" db:"description"`
// }

type MenuDTO struct {
	Id     string `json:"id" db:"id"`
	RoleId string `json:"roleId" db:"role_id"`
	Name   string `json:"name" db:"name"`
	Type   string `json:"type" db:"type"`
	Path   string `json:"path" db:"path"`
	Method string `json:"method" db:"method"`
	IsShow bool   `json:"isShow" db:"is_show"`
}

type Menu struct {
	Id              string `json:"id" db:"id"`
	RoleId          string `json:"roleId,omitempty" db:"role"`
	RoleName        string `json:"roleName,omitempty" db:"role_name"`
	MenuItemId      string `json:"menuItemId,omitempty" db:"menu_item"`
	MenuName        string `json:"menuName" db:"menu_name"`
	MenuDescription string `json:"menuDescription" db:"description"`
	IsShow          bool   `json:"isShow,omitempty" db:"is_show"`
}

type MenuByRoleDTO struct {
	Id          string `json:"id" db:"id"`
	Name        string `json:"name" db:"name"`
	Description string `json:"description" db:"description"`
}

type CreateMenuDTO struct {
}
