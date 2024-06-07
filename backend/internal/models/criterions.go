package models

type Criterion struct {
	Id       string `json:"id" db:"id"`
	Key      string `json:"key" db:"key"`
	Label    string `json:"label" db:"label"`
	Type     string `json:"type" db:"type"`
	Priority int    `json:"priority" db:"priority"`
}

type CriterionParams struct {
	EnabledKeys []string `json:"enabledKeys"`
}

type CompleteCriterion struct {
	Id       string `json:"id" db:"id"`
	Key      string `json:"key" db:"key"`
	Label    string `json:"label" db:"label"`
	Type     string `json:"type" db:"type"`
	Date     int64  `json:"date" db:"date"`
	Complete bool   `json:"complete" db:"complete"`
}

type GetCriterionDTO struct {
	Date  int64    `json:"date"`
	Types []string `json:"types"`
	// Role  string   `json:"role"`
	// EnabledKeys []string `json:"enabledKeys"`
}

type CompleteCriterionDTO struct {
	Id          string `json:"id" db:"id"`
	CriterionId string `json:"criterionId" db:"criterion_id"`
	Date        int64  `json:"date" db:"date"`
}

// type CompleteCriterionDTO struct {
// 	Role        string
// 	Type        string `json:"type"`
// 	Date        int64  `json:"date"`
// 	CriterionId string
// }

type ReportFilter struct {
	Type     string `json:"type"`
	Role     string
	LastDate string `json:"date"`
}

type GetCompeteDTO struct {
	Date        string   `json:"date"`
	Role        string   `json:"role"`
	EnabledKeys []string `json:"enabledKeys"`
}

type Complete struct {
	Date          int64 `json:"date" db:"date"`
	Complete      bool  `json:"complete" db:"complete"`
	CompleteCount int
	Count         int
}
type CompleteCount struct {
	Date  int64 `json:"date" db:"date"`
	Count int   `json:"count" db:"count"`
}
