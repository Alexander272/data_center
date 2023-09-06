package postgres

import (
	"context"
	"fmt"
	"time"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type CriterionsRepo struct {
	db *sqlx.DB
}

func NewCriterionsRepo(db *sqlx.DB) *CriterionsRepo {
	return &CriterionsRepo{
		db: db,
	}
}

type Criterions interface {
	GetAll(context.Context) ([]models.Criterions, error)
	// GetByRole(context.Context, string) ([]models.Criterions, error)
	GetByRole(ctx context.Context, role, day string) (criterions []models.CriterionsWithData, err error)
}

func (r *CriterionsRepo) GetAll(ctx context.Context) (criterions []models.Criterions, err error) {
	query := fmt.Sprintf(`SELECT id, key, label, type FROM %s ORDER BY priority`, CriterionsTable)

	if err := r.db.Select(&criterions, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return criterions, nil
}

// func (r *CriterionsRepo) GetByRole(ctx context.Context, role string) (criterions []models.Criterions, err error) {
// 	query := fmt.Sprintf(`SELECT c.id, key, label, c.type FROM %s AS c
// 		LEFT JOIN %s as m ON name like key||':POST' OR name like key||':ALL' OR name='*:ALL'
// 		INNER JOIN %s as r ON r.id=role_id
// 		WHERE m.type='APP' AND m.is_show=true AND r.name=$1 ORDER BY priority`,
// 		CriterionsTable, MenuTable, RoleTable,
// 	)

//		if err := r.db.Select(&criterions, query, role); err != nil {
//			return nil, fmt.Errorf("failed to execute query. error: %w", err)
//		}
//		return criterions, nil
//	}
func (r *CriterionsRepo) GetByRole(ctx context.Context, role, day string) (criterions []models.CriterionsWithData, err error) {
	query := fmt.Sprintf(`SELECT c.id, key, label, c.type, COALESCE(cc.date, '') as day, NOT(cc.id IS NULL) as complete
		FROM %s AS c 
		LEFT JOIN %s as m ON name like key||':POST' OR name like key||':ALL' OR name='*:ALL'
		LEFT JOIN %s as r ON r.id=role_id
		LEFT JOIN %s as cc ON cc.criterion_id=c.id AND cc.type=c.type AND cc.date=$1
		WHERE m.type='APP' AND m.is_show=true AND r.name=$2 ORDER BY priority`,
		CriterionsTable, MenuTable, RoleTable, CompleteCriterionTable,
	)

	//TODO если период равен месяцу можно парсить его по примеру time.Parse("01.2006", "09.2023")

	date, err := time.Parse("02.01.2006", day)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&criterions, query, fmt.Sprintf("%d", date.Unix()), role); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return criterions, nil
}

/*
SELECT c.id, key, label, c.type
	FROM public.criterions AS c LEFT JOIN menu as m ON name like key||':POST' OR name like key||':ALL' OR name='*:ALL'
	WHERE m.type='APP' AND m.is_show=true AND role_id='7d110503-7af9-4ebd-aa36-9cf512ba3438'

SELECT c.id, key, label, c.type
	FROM public.criterions AS c LEFT JOIN menu as m ON name like key||':POST' OR name like key||':ALL' OR name='*:ALL'
	INNER JOIN roles as r ON r.id=role_id
	WHERE m.type='APP' AND m.is_show=true AND r.name='pdd'
*/
