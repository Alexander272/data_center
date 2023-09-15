package models

type OutputVolume struct {
	Id       string `json:"id" db:"id"`
	ForStock bool   `json:"forStock" db:"for_stock"`
	Day      string `json:"day" db:"day" binding:"required"`
	Product  string `json:"product" db:"product" binding:"required"`
	Count    string `json:"count" db:"count"`
	Money    string `json:"money" db:"money"`
}
