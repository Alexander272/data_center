package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type QualityRepo struct {
	db *sqlx.DB
}

func NewQualityRepo(db *sqlx.DB) *QualityRepo {
	return &QualityRepo{
		db: db,
	}
}

type Quality interface {
	GetByPeriod(ctx context.Context, req *models.GetQualityDTO) ([]*models.Quality, error)
	Create(ctx context.Context, dto *models.Quality) error
	CreateSeveral(ctx context.Context, dto []*models.Quality) error
	Update(ctx context.Context, dto *models.Quality) error
	UpdateSeveral(ctx context.Context, dto []*models.Quality) error
	Delete(ctx context.Context, id string) error
}

func (r *QualityRepo) GetByPeriod(ctx context.Context, req *models.GetQualityDTO) ([]*models.Quality, error) {
	condition := "date=$1"
	args := []interface{}{req.Period.From}
	if req.Period.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.Period.To)
	}
	condition += fmt.Sprintf(" AND product=$%d", len(args)+1)
	args = append(args, req.Product)

	query := fmt.Sprintf(`SELECT id, date, type, product, number, title, amount, percent, cost FROM %s WHERE %s ORDER BY date, number`,
		QualityTable, condition,
	)
	data := []*models.Quality{}

	if err := r.db.SelectContext(ctx, &data, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return data, nil
}

func (r *QualityRepo) Create(ctx context.Context, dto *models.Quality) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, type, product, title, number, amount, percent, cost) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		QualityTable,
	)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Date, dto.Type, dto.Product, dto.Title, dto.Number, dto.Amount, dto.Percent, dto.Cost)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *QualityRepo) CreateSeveral(ctx context.Context, dto []*models.Quality) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, type, product, title, number, amount, percent, cost) VALUES `, QualityTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 9
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d, $%d)",
			i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6, i*c+7, i*c+8, i*c+9,
		))
		args = append(args, id, f.Date, f.Type, f.Product, f.Title, f.Number, f.Amount, f.Percent, f.Cost)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *QualityRepo) Update(ctx context.Context, dto *models.Quality) error {
	query := fmt.Sprintf(`UPDATE %s SET type=$1, product=$2, title=$3, number=$4, amount=$5, cost=$6, percent=$7 WHERE id=$8`, QualityTable)

	_, err := r.db.ExecContext(ctx, query, dto.Type, dto.Product, dto.Title, dto.Number, dto.Amount, dto.Cost, dto.Percent, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *QualityRepo) UpdateSeveral(ctx context.Context, dto []*models.Quality) error {
	values := []string{}
	args := []interface{}{}

	c := 9
	for i, v := range dto {
		args = append(args, v.Id, v.Date, v.Type, v.Product, v.Title, v.Number, v.Amount, v.Percent, v.Cost)
		values = append(values, fmt.Sprintf("($%d, $%d::integer, $%d, $%d, $%d, $%d::integer, $%d::integer, $%d::integer, $%d::real)",
			i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6, i*c+7, i*c+8, i*c+9,
		))
	}

	query := fmt.Sprintf(`UPDATE %s AS t SET date=s.date, type=s.type, product=s.product, title=s.title, number=s.number, 
		amount=s.amount, percent=s.percent, cost=s.cost 
		FROM (VALUES %s) AS s(id, date, type, product, title, number, amount, percent, cost) WHERE t.id=s.id::uuid`,
		QualityTable, strings.Join(values, ","),
	)

	if _, err := r.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *QualityRepo) Delete(ctx context.Context, id string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, QualityTable)

	_, err := r.db.ExecContext(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
