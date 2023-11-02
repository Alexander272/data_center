package models

type ShippingPlan struct {
	Id             string `json:"id" db:"id"`
	Day            string `json:"day" db:"day" binding:"required"`
	NumberOfOrders int    `json:"numberOfOrders" db:"number_of_orders"`
	SumMoney       string `json:"sumMoney" db:"sum_money"`
	Quantity       int    `json:"quantity" db:"quantity"`
}
