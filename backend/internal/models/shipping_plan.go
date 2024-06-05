package models

type ShippingPlan struct {
	Id             string `json:"id" db:"id"`
	Date           int64  `json:"date" db:"date" binding:"required"`
	NumberOfOrders int    `json:"numberOfOrders" db:"number_of_orders"`
	SumMoney       string `json:"sumMoney" db:"sum_money"`
	Quantity       int    `json:"quantity" db:"quantity"`
}
