package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
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

type CompleteCriterion interface {
	Get(context.Context, *models.ReportFilter) ([]*models.ReportComplete, error)
	Create(context.Context, *models.CompleteCriterion) error
	DeleteOld(context.Context, string) error
}

/*
	TODO Сейчас выполнение всех критериев отрабатывает некорректно (иногда)
	Похоже надо как-то переписывать это все
*/

func (r *CompleteCriterionRepo) Get(ctx context.Context, req *models.ReportFilter) ([]*models.ReportComplete, error) {
	query := fmt.Sprintf(`SELECT date, CASE WHEN COUNT(criterion_id) = (SELECT COUNT(id) FROM %s AS m
		WHERE method LIKE '%%(POST)|(PUT)|(DELETE)' AND m.type='API' AND m.role_id=c.role_id
		) THEN true ELSE false END AS complete
		FROM %s AS c
		INNER JOIN %s AS r ON r.id=c.role_id
		GROUP BY role_id, name, date, type 
		HAVING type=$1 AND r.name=$2 AND date>=$3 LIMIT 7`,
		MenuTable, CompleteCriterionTable, RoleTable,
	)
	complete := []*models.ReportComplete{}

	if err := r.db.SelectContext(ctx, &complete, query, req.Type, req.Role, req.LastDate); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return complete, nil
}

func (r *CompleteCriterionRepo) Create(ctx context.Context, dto *models.CompleteCriterion) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, role_id, type, date, criterion_id) 
		VALUES ($1, (SELECT id FROM %s WHERE name=$2 LIMIT 1), $3,  $4, $5)`,
		CompleteCriterionTable, RoleTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Role, dto.Type, dto.Date, dto.CriterionId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *CompleteCriterionRepo) DeleteOld(ctx context.Context, date string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date<$1`, CompleteCriterionTable)

	_, err := r.db.ExecContext(ctx, query, date)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
