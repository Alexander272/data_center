package models

type Criterions struct {
	Id    string `json:"id" db:"id"`
	Key   string `json:"key" db:"key"`
	Label string `json:"label" db:"label"`
	Type  string `json:"type" db:"type"`
}

type CriterionsWithData struct {
	Id       string `json:"id" db:"id"`
	Key      string `json:"key" db:"key"`
	Label    string `json:"label" db:"label"`
	Type     string `json:"type" db:"type"`
	Day      string `json:"day" db:"day"`
	Complete bool   `json:"complete" db:"complete"`
}

type CompleteCriterion struct {
	Role        string
	Type        string `json:"type"`
	Date        string `json:"date"`
	CriterionId string
}

type ReportFilter struct {
	Type     string `json:"type"`
	Role     string
	LastDate string `json:"date"`
}

type ReportComplete struct {
	Date     string `json:"date" db:"date"`
	Complete bool   `json:"complete" db:"complete"`
}
