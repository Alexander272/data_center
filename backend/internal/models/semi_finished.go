package models

type SemiFinished struct {
	Id      string `json:"id" db:"id"`
	Day     int64  `json:"day" db:"day" binding:"required"`
	Product string `json:"product" db:"product" binding:"required"`
	Count   int    `json:"count" db:"count"`
}
