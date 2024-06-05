package models

type OutputVolume struct {
	Id       string `json:"id" db:"id"`
	ForStock bool   `json:"forStock" db:"for_stock"`
	Date     int64  `json:"date" db:"date" binding:"required"`
	Product  string `json:"product" db:"product" binding:"required"`
	Count    string `json:"count" db:"count"`
	Money    string `json:"money" db:"money"`
}
