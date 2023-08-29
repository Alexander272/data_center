package models

type ShipmentPlan struct {
	Id      string `json:"id" db:"id"`
	Day     string `json:"day" db:"day" binding:"required"`
	Product string `json:"product" db:"product" binding:"required"`
	Count   string `json:"count" db:"count" binding:"required"`
	Money   string `json:"money" db:"money" binding:"required"`
}
