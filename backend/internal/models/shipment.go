package models

type Shipment struct {
	Id      string `json:"id" db:"id"`
	Day     string `json:"day" db:"day" binding:"required"`
	Product string `json:"product" db:"product" binding:"required"`
	Count   string `json:"count" db:"count"`
	Money   string `json:"money" db:"money"`
}

type ShipmentGrouped struct {
	Day      string     `json:"day"`
	Shipment []Shipment `json:"shipment"`
}
