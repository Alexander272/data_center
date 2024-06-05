package models

type SemiFinished struct {
	Id      string `json:"id" db:"id"`
	Date    int64  `json:"date" db:"date" binding:"required"`
	Product string `json:"product" db:"product" binding:"required"`
	Count   int    `json:"count" db:"count"`
}
