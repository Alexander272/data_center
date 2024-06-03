package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ToolingRepo struct {
	db *sqlx.DB
}

func NewTooling(db *sqlx.DB) *ToolingRepo {
	return &ToolingRepo{
		db: db,
	}
}

type Tooling interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.Tooling, error)
	Create(context.Context, *models.Tooling) error
	Update(context.Context, *models.Tooling) error
	UpdateByDay(context.Context, *models.Tooling) error
	DeleteByDay(context.Context, string) error
}

func (r *ToolingRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Tooling, error) {
	condition := "day=$1"
	if req.To != "" {
		condition = "day>=$1 AND day<=$2"
	}

	query := fmt.Sprintf(`SELECT id, day, request, done, progress FROM %s WHERE %s`, ToolingTable, condition)
	data := []*models.Tooling{}

	if err := r.db.SelectContext(ctx, &data, query, req.From, req.To); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *ToolingRepo) Create(ctx context.Context, dto *models.Tooling) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, request, done, progress) VALUES (:id, :day, :request, :done, :progress)`, ToolingTable)
	id := uuid.New()
	dto.Id = id.String()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ToolingRepo) Update(ctx context.Context, dto *models.Tooling) error {
	query := fmt.Sprintf(`UPDATE %s SET day=:day, request=:request, done=:done, progress=:progress WHERE id=:id`, ToolingTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ToolingRepo) UpdateByDay(ctx context.Context, dto *models.Tooling) error {
	query := fmt.Sprintf(`UPDATE %s SET request=:request, done=:done, progress=:progress WHERE day=:day`, ToolingTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ToolingRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, ToolingTable)

	if _, err := r.db.ExecContext(ctx, query, day); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
