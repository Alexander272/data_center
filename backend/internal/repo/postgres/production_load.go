package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ProductionLoadRepo struct {
	db *sqlx.DB
}

func NewProductionLoadRepo(db *sqlx.DB) *ProductionLoadRepo {
	return &ProductionLoadRepo{
		db: db,
	}
}

type ProductionLoad interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.ProductionLoad, error)
	CreateSeveral(context.Context, []*models.ProductionLoad) error
	DeleteByDate(context.Context, string) error
}

func (r *ProductionLoadRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.ProductionLoad, error) {
	condition := "date=$1"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.To)
	}

	query := fmt.Sprintf(`SELECT id, date, sector, days, quantity FROM %s WHERE %s ORDER BY date, sector`, ProductionLoadTable, condition)
	load := []*models.ProductionLoad{}

	if err := r.db.SelectContext(ctx, &load, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return load, nil
}

func (r *ProductionLoadRepo) CreateSeveral(ctx context.Context, dto []*models.ProductionLoad) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, sector, days, quantity) VALUES `, ProductionLoadTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 5
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, f.Date, f.Sector, f.Days, f.Quantity)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ProductionLoadRepo) DeleteByDate(ctx context.Context, date string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, ProductionLoadTable)

	_, err := r.db.ExecContext(ctx, query, date)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
