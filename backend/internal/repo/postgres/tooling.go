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
	condition := "date=$1"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.To)
	}

	// query := fmt.Sprintf(`SELECT id, date, request, done, lt.progress FROM %s AS t
	// 	LEFT JOIN LATERAL (SELECT SUM(request)-SUM(done) AS progress FROM %s WHERE date<=t.date) AS lt ON true
	// 	WHERE %s ORDER BY date`,
	// 	ToolingTable, ToolingTable, condition,
	// )
	query := fmt.Sprintf(`SELECT id, date, request, done, progress FROM %s WHERE %s ORDER BY date`, ToolingTable, condition)
	data := []*models.Tooling{}

	if err := r.db.SelectContext(ctx, &data, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *ToolingRepo) Create(ctx context.Context, dto *models.Tooling) error {
	// query := fmt.Sprintf(`INSERT INTO %s(id, date, request, done, progress) VALUES ($1, $2, $3, $4,
	// 	($5+COALESCE((SELECT progress FROM %s WHERE date=$2-60*60*24),0)))`,
	// 	ToolingTable, ToolingTable,
	// )
	query := fmt.Sprintf(`INSERT INTO %s(id, date, request, done, progress) VALUES (:id, :date, :request, :done, 
		(:progress+COALESCE((SELECT progress FROM %s WHERE date=:date-60*60*24),0)))`,
		ToolingTable, ToolingTable,
	)
	id := uuid.New()
	dto.Id = id.String()
	dto.Progress = dto.Request - dto.Done

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ToolingRepo) Update(ctx context.Context, dto *models.Tooling) error {
	query := fmt.Sprintf(`UPDATE %s SET date=:date, request=:request, done=:done WHERE id=:id`, ToolingTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	query = fmt.Sprintf(`UPDATE %s AS t SET progress=ot.progress
		FROM (SELECT id, lt.progress FROM %s AS t
			LEFT JOIN LATERAL (SELECT SUM(request)-SUM(done) AS progress FROM %s WHERE date<=t.date) AS lt ON true
			ORDER BY date
		) AS ot WHERE t.id=ot.id`,
		ToolingTable, ToolingTable, ToolingTable,
	)
	if _, err := r.db.ExecContext(ctx, query); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}

	return nil
}

func (r *ToolingRepo) UpdateByDay(ctx context.Context, dto *models.Tooling) error {
	query := fmt.Sprintf(`UPDATE %s SET request=:request, done=:done, progress=:progress WHERE date=:date`, ToolingTable)

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ToolingRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, ToolingTable)

	if _, err := r.db.ExecContext(ctx, query, day); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
