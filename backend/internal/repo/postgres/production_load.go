package postgres

import (
	"context"
	"fmt"
	"strings"
	"time"

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
	GetByPeriod(context.Context, models.Period) ([]models.ProductionLoad, error)
	CreateSeveral(context.Context, []models.ProductionLoad) error
	DeleteByDate(context.Context, string) error
}

func (r *ProductionLoadRepo) GetByPeriod(ctx context.Context, period models.Period) (load []models.ProductionLoad, err error) {
	args := make([]interface{}, 0)
	condition := "date=$1"
	from, err := time.Parse("02.01.2006", period.From)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}
	args = append(args, fmt.Sprintf("%d", from.Unix()))

	if period.To != "" {
		to, err := time.Parse("02.01.2006", period.To)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}
		args = append(args, fmt.Sprintf("%d", to.Unix()))
		condition = "date>=$1 AND date<$2"
	}

	query := fmt.Sprintf(`SELECT id, date, sector, days FROM %s WHERE %s`, ProductionLoadTable, condition)

	if err := r.db.Select(&load, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return load, nil
}

func (r *ProductionLoadRepo) CreateSeveral(ctx context.Context, load []models.ProductionLoad) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, sector, days) VALUES `, ProductionLoadTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(load))

	date, err := time.Parse("02.01.2006", load[0].Date)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	c := 4
	for i, f := range load {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4))
		args = append(args, id, fmt.Sprintf("%d", date.Unix()), f.Sector, f.Days)
	}
	query += strings.Join(values, ", ")

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ProductionLoadRepo) DeleteByDate(ctx context.Context, date string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, ProductionLoadTable)

	d, err := time.Parse("02.01.2006", date)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, fmt.Sprintf("%d", d.Unix()))
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
