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

type OutputVolumeRepo struct {
	db *sqlx.DB
}

func NewOutputVolumeRepo(db *sqlx.DB) *OutputVolumeRepo {
	return &OutputVolumeRepo{
		db: db,
	}
}

type OutputVolume interface {
	GetByDay(context.Context, string) ([]models.OutputVolume, error)
	GetByPeriod(context.Context, models.Period) ([]models.OutputVolume, error)
	CreateSeveral(context.Context, []models.OutputVolume) error
	DeleteByDay(context.Context, string) error
}

func (r *OutputVolumeRepo) GetByDay(ctx context.Context, day string) (output []models.OutputVolume, err error) {
	query := fmt.Sprintf(`SELECT id, for_stock, day, product, count, money FROM %s WHERE day=$1`, OutputVolumeTable)

	d, err := time.Parse("02.01.2006", day)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&output, query, fmt.Sprintf("%d", d.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return output, nil
}

func (r *OutputVolumeRepo) GetByPeriod(ctx context.Context, period models.Period) (output []models.OutputVolume, err error) {
	from, err := time.Parse("02.01.2006", period.From)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}
	to, err := time.Parse("02.01.2006", period.To)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	query := fmt.Sprintf(`SELECT id, for_stock, day, product, count, money FROM %s WHERE day>=$1 AND day<$2`, OutputVolumeTable)

	if err := r.db.Select(&output, query, fmt.Sprintf("%d", from.Unix()), fmt.Sprintf("%d", to.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return output, nil
}

func (r *OutputVolumeRepo) CreateSeveral(ctx context.Context, output []models.OutputVolume) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, for_stock, day, product, count, money) VALUES `, OutputVolumeTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(output))

	day, err := time.Parse("02.01.2006", output[0].Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	c := 6
	for i, f := range output {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6))
		args = append(args, id, f.ForStock, fmt.Sprintf("%d", day.Unix()), f.Product, f.Count, f.Money)
	}
	query += strings.Join(values, ", ")

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OutputVolumeRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, OutputVolumeTable)

	d, err := time.Parse("02.01.2006", day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, fmt.Sprintf("%d", d.Unix()))
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
