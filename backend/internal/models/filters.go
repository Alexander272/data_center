package models

type Period struct {
	From string `json:"from"`
	To   string `json:"to"`
}

type PeriodUnix struct {
	From int64 `json:"from"`
	To   int64 `json:"to"`
}
