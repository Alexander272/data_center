package models

type Tooling struct {
	Id       string `json:"id" db:"id"`
	Date     int64  `json:"date" db:"date" binding:"required"`
	Request  int    `json:"request" db:"request"`
	Done     int    `json:"done" db:"done"`
	Progress int    `json:"progress" db:"progress"`
}
