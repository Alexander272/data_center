package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type SemiFinishedRepo struct {
	db *sqlx.DB
}

func NewSemiFinishedRepo(db *sqlx.DB) *SemiFinishedRepo {
	return &SemiFinishedRepo{
		db: db,
	}
}

type SemiFinished interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.SemiFinished, error)
	Create(context.Context, *models.SemiFinished) error
	CreateSeveral(context.Context, []*models.SemiFinished) error
	UpdateSeveral(context.Context, []*models.SemiFinished) error
	DeleteByDay(context.Context, string) error
}

func (r *SemiFinishedRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.SemiFinished, error) {
	condition := "date=$1"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.To)
	}

	query := fmt.Sprintf(`SELECT id, date, product, count FROM %s WHERE %s ORDER BY product, date`, SemiFinishedTable, condition)
	semiFinished := []*models.SemiFinished{}

	if err := r.db.SelectContext(ctx, &semiFinished, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return semiFinished, nil
}

func (r *SemiFinishedRepo) Create(ctx context.Context, dto *models.SemiFinished) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, product, count) VALUES (:id, :date, :product, :count)`, SemiFinishedTable)
	id := uuid.New()
	dto.Id = id.String()

	if _, err := r.db.NamedExecContext(ctx, query, dto); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SemiFinishedRepo) CreateSeveral(ctx context.Context, dto []*models.SemiFinished) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, product, count) VALUES `, SemiFinishedTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 4
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4))
		args = append(args, id, f.Date, f.Product, f.Count)
	}
	query += strings.Join(values, ", ")

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SemiFinishedRepo) UpdateSeveral(ctx context.Context, dto []*models.SemiFinished) error {
	values := []string{}
	args := []interface{}{}

	c := 4
	for i, v := range dto {
		args = append(args, v.Id, v.Date, v.Product, v.Count)
		values = append(values, fmt.Sprintf("($%d, $%d::integer, $%d, $%d::integer)", i*c+1, i*c+2, i*c+3, i*c+4))
	}

	query := fmt.Sprintf(`UPDATE %s AS t SET date=s.date, product=s.product, count=s.count 
		FROM (VALUES %s) AS s(id, date, product, count) WHERE t.id=s.id::uuid`,
		SemiFinishedTable, strings.Join(values, ","),
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *SemiFinishedRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, SemiFinishedTable)

	if _, err := r.db.ExecContext(ctx, query, day); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
