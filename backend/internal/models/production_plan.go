package models

type ProductionPlan struct {
	Id     string `json:"id" db:"id"`
	Date   string `json:"date" db:"date" binding:"required"`
	Sector string `json:"sector" db:"sector" binding:"required"`
	Money  string `json:"money" db:"money" binding:"required"`
	//TODO  binding:"required" добавить в Quantity
	Quantity int    `json:"quantity" db:"quantity"`
	Type     string `json:"type" db:"type"`
}
