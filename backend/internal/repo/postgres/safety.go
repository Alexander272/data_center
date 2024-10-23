package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SafetyRepo struct {
	db *sqlx.DB
}

func NewSafetyRepo(db *sqlx.DB) *SafetyRepo {
	return &SafetyRepo{
		db: db,
	}
}

type Safety interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.Safety, error)
	Create(context.Context, *models.Safety) error
	Update(context.Context, *models.Safety) error
	UpdateByDate(context.Context, *models.Safety) error
	DeleteByDate(context.Context, string) error
}

func (r *SafetyRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Safety, error) {
	condition := "date=$1"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.To)
	}

	query := fmt.Sprintf(`SELECT id, date, violations, injuries FROM %s WHERE %s ORDER BY date`, SafetyTable, condition)
	data := []*models.Safety{}

	if err := r.db.SelectContext(ctx, &data, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *SafetyRepo) Create(ctx context.Context, dto *models.Safety) error {
	query := fmt.Sprintf(`INSERT INTO %s (id, date, violations, injuries) VALUES (:id, :date, :violations, :injuries)`, SafetyTable)
	dto.Id = uuid.NewString()

	_, err := r.db.NamedExecContext(ctx, query, dto)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SafetyRepo) Update(ctx context.Context, dto *models.Safety) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, violations=:violations, injuries=:injuries WHERE id=:id`, SafetyTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SafetyRepo) UpdateByDate(ctx context.Context, dto *models.Safety) error {
	query := fmt.Sprintf(`UPDATE %s SET violations=:violations, injuries=:injuries WHERE date=:date`, SafetyTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SafetyRepo) DeleteByDate(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, SafetyTable)

	if _, err := r.db.ExecContext(ctx, query, day); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
