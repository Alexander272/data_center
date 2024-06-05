package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type OutputVolumeRepo struct {
	db *sqlx.DB
}

func NewOutputVolumeRepo(db *sqlx.DB) *OutputVolumeRepo {
	return &OutputVolumeRepo{
		db: db,
	}
}

type OutputVolume interface {
	GetByDay(context.Context, string) ([]*models.OutputVolume, error)
	GetByPeriod(context.Context, *models.Period) ([]*models.OutputVolume, error)
	CreateSeveral(context.Context, []*models.OutputVolume) error
	DeleteByDay(context.Context, string) error
}

func (r *OutputVolumeRepo) GetByDay(ctx context.Context, day string) ([]*models.OutputVolume, error) {
	query := fmt.Sprintf(`SELECT o.id, for_stock, date, product, o.count, money FROM %s AS o
		INNER JOIN %s AS p ON product=p.title WHERE date=$1 ORDER BY p.count`,
		OutputVolumeTable, ProductsTable,
	)
	output := []*models.OutputVolume{}

	if err := r.db.SelectContext(ctx, &output, query, day); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return output, nil
}

func (r *OutputVolumeRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.OutputVolume, error) {
	query := fmt.Sprintf(`SELECT o.id, for_stock, date, product, o.count, money FROM %s AS o
		INNER JOIN %s AS p ON product=p.title WHERE date>=$1 AND date<=$2  ORDER BY date, p.count`,
		OutputVolumeTable, ProductsTable,
	)
	output := []*models.OutputVolume{}

	if err := r.db.SelectContext(ctx, &output, query, req.From, req.To); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return output, nil
}

func (r *OutputVolumeRepo) CreateSeveral(ctx context.Context, dto []*models.OutputVolume) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, for_stock, date, product, count, money) VALUES `, OutputVolumeTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 6
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6))
		args = append(args, id, f.ForStock, f.Date, f.Product, f.Count, f.Money)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OutputVolumeRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, OutputVolumeTable)

	_, err := r.db.ExecContext(ctx, query, day)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
