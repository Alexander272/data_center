package models

type Tooling struct {
	Id       string `json:"id" db:"id"`
	Day      int64  `json:"day" db:"day" binding:"required"`
	Request  int    `json:"request" db:"request"`
	Done     int    `json:"done" db:"done"`
	Progress int    `json:"progress" db:"progress"`
}
