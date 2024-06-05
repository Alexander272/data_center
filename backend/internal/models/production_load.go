package models

type ProductionLoad struct {
	Id       string `json:"id" db:"id"`
	Date     int64  `json:"date" db:"date" binding:"required"`
	Sector   string `json:"sector" db:"sector" binding:"required"`
	Days     int    `json:"days" db:"days" binding:"required"`
	Quantity int    `json:"quantity" db:"quantity"`
}
