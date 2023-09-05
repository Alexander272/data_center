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
