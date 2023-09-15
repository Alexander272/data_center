package models

type ProductionPlan struct {
	Id       string `json:"id" db:"id"`
	Date     string `json:"date" db:"date" binding:"required"`
	Product  string `json:"product" db:"product" binding:"required"`
	Money    string `json:"money" db:"money"`
	Quantity int    `json:"quantity" db:"quantity"`
	Type     string `json:"type" db:"type"`
}
