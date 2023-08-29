package models

type OrdersVolume struct {
	Id             string `json:"id" db:"id"`
	Day            string `json:"day" db:"day" binding:"required"`
	NumberOfOrders int    `json:"numberOfOrders" db:"number_of_orders" binding:"required"`
	SumMoney       string `json:"sumMoney" db:"sum_money" binding:"required"`
	Quantity       int    `json:"quantity" db:"quantity" binding:"required"`
}
