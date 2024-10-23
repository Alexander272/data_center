package models

type Safety struct {
	Id         string `json:"id" db:"id"`
	Date       int64  `json:"date" db:"date" binding:"required"`
	Violations int    `json:"violations" db:"violations"`
	Injuries   int    `json:"injuries" db:"injuries"`
}
