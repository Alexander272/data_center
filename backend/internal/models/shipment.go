package models

type Shipment struct {
	Id      string `json:"id" db:"id"`
	Date    int64  `json:"date" db:"date" binding:"required"`
	Product string `json:"product" db:"product" binding:"required"`
	Count   string `json:"count" db:"count"`
	Money   string `json:"money" db:"money"`
}

type ShipmentGrouped struct {
	Date     int64      `json:"date"`
	Shipment []Shipment `json:"shipment"`
}
