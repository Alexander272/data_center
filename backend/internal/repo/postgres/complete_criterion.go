package postgres

import (
	"github.com/jmoiron/sqlx"
)

type CompleteCriterionRepo struct {
	db *sqlx.DB
}

func NewCompleteCriterionRepo(db *sqlx.DB) *CompleteCriterionRepo {
	return &CompleteCriterionRepo{
		db: db,
	}
}

type CompleteCriterion interface{}

// func (r *CompleteCriterionRepo) Get(ctx context.Context)
