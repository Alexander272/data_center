package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
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
	GetAll(context.Context, *models.CriterionParams) ([]*models.Criterion, error)
	GetByDate(context.Context, *models.GetCriterionDTO) ([]*models.CompleteCriterion, error)
	GetByRole(ctx context.Context, role, day string) (criterions []models.CompleteCriterion, err error)
}

func (r *CriterionsRepo) GetAll(ctx context.Context, req *models.CriterionParams) ([]*models.Criterion, error) {
	condition := ""
	params := []interface{}{}
	if req != nil {
		condition = " WHERE "
		values := []string{}
		if len(req.EnabledKeys) > 0 {
			values = append(values, fmt.Sprintf("key=ANY($%d)", len(values)+1))
			params = append(params, pq.Array(req.EnabledKeys))
		}
		condition += strings.Join(values, " AND ")
	}

	query := fmt.Sprintf(`SELECT id, key, label, type, priority FROM %s%s ORDER BY type, priority`, CriterionsTable, condition)
	data := []*models.Criterion{}

	if err := r.db.SelectContext(ctx, &data, query, params...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *CriterionsRepo) GetByDate(ctx context.Context, req *models.GetCriterionDTO) ([]*models.CompleteCriterion, error) {
	query := fmt.Sprintf(`SELECT c.id, key, label, c.type, COALESCE(cc.date, 0) date, cc.id IS NOT NULL complete
		FROM %s AS c LEFT JOIN %s AS cc ON cc.criterion_id=c.id AND cc.date=$1
		WHERE c.type = ANY($2)  ORDER BY priority`,
		// WHERE c.type = ANY($2)  ORDER BY c.type, priority`,
		// AND key=ANY($3)
		CriterionsTable, CompleteCriterionTable,
	)
	data := []*models.CompleteCriterion{}

	/*
		SELECT c.id, key, label, type, COALESCE(cc.date, 0) date, to_timestamp(date) AT TIME ZONE 'Asia/Yekaterinburg', cc.id IS NOT NULL complete
			FROM criterions AS c LEFT JOIN complete_criterion AS cc ON cc.criterion_id=c.id AND
			(cc.date=1717268400 OR (type='monthly' AND date_part('month',to_timestamp(date))=date_part('month',to_timestamp(1717268400))))
			WHERE type=ANY(array['daily', 'monthly']) ORDER BY c.type, priority
	*/

	if err := r.db.SelectContext(ctx, &data, query, req.Date, pq.Array(req.Types)); err != nil {
		// , req.EnabledKeys
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
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
func (r *CriterionsRepo) GetByRole(ctx context.Context, role, day string) (criterions []models.CompleteCriterion, err error) {
	query := fmt.Sprintf(`SELECT c.id, key, label, c.type, COALESCE(cc.date, 0) as date, NOT(cc.id IS NULL) as complete
		FROM %s AS c 
		LEFT JOIN %s as m ON name like key||':POST' OR name like key||':ALL' OR name='*:ALL'
		LEFT JOIN %s as r ON r.id=role_id
		LEFT JOIN %s as cc ON cc.criterion_id=c.id AND cc.type=c.type AND cc.date=$1
		WHERE m.type='APP' AND m.is_show=true AND r.name=$2 ORDER BY priority`,
		CriterionsTable, MenuTable, RoleTable, CompleteCriterionTable,
	)

	/*
		SELECT c.id, key, label, c.type, COALESCE(cc.date, 0) date, cc.id IS NOT NULL complete
			FROM criterions AS c
			LEFT JOIN complete_criterion AS cc ON cc.criterion_id=c.id AND cc.date=1717459200
		WHERE c.type = ANY(ARRAY['day']) AND key=ANY(ARRAY['tooling'])
	*/

	if err := r.db.Select(&criterions, query, day, role); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return criterions, nil
}
