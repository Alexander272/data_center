package models

type Quality struct {
	Id      string  `json:"id" db:"id"`
	Date    int64   `json:"date" db:"date"`
	Type    string  `json:"type" db:"type"`
	Product string  `json:"product" db:"product"`
	Title   string  `json:"title" db:"title"`
	Number  int     `json:"number" db:"number"`
	Amount  int     `json:"amount" db:"amount"`
	Percent int     `json:"percent" db:"percent"`
	Cost    float64 `json:"cost" db:"cost"`
}

type GetQualityDTO struct {
	Product string  `json:"product"`
	Period  *Period `json:"period"`
}
