package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ShipmentRepo struct {
	db *sqlx.DB
}

func NewShipmentRepo(db *sqlx.DB) *ShipmentRepo {
	return &ShipmentRepo{
		db: db,
	}
}

type Shipment interface {
	GetByDay(context.Context, string) ([]*models.Shipment, error)
	GetByPeriod(context.Context, *models.Period) ([]*models.Shipment, error)
	Create(context.Context, *models.Shipment) error
	CreateSeveral(context.Context, []*models.Shipment) error
	DeleteByDay(context.Context, string) error
}

func (r *ShipmentRepo) GetByDay(ctx context.Context, day string) ([]*models.Shipment, error) {
	query := fmt.Sprintf(`SELECT s.id, date, product, s.count, money FROM %s as s
		INNER JOIN %s AS p ON product=p.title WHERE date=$1 ORDER BY p.count`,
		ShipmentTable, ProductsTable,
	)
	shipment := []*models.Shipment{}

	if err := r.db.SelectContext(ctx, &shipment, query, day); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return shipment, nil
}

func (r *ShipmentRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Shipment, error) {

	query := fmt.Sprintf(`SELECT s.id, date, product, s.count, money FROM %s as s
 		INNER JOIN %s AS p ON product=p.title WHERE date>=$1 AND date<=$2 ORDER BY date, p.count`,
		ShipmentTable, ProductsTable,
	)
	shipment := []*models.Shipment{}

	if err := r.db.SelectContext(ctx, &shipment, query, req.From, req.To); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return shipment, nil
}

func (r *ShipmentRepo) Create(ctx context.Context, dto *models.Shipment) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, product, count, money) VALUES ($1, $2, $3, $4, $5)`, ShipmentTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Date, dto.Product, dto.Count, dto.Money)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentRepo) CreateSeveral(ctx context.Context, dto []*models.Shipment) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, product, count, money) VALUES `, ShipmentTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 5
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, f.Date, f.Product, f.Count, f.Money)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, ShipmentTable)

	_, err := r.db.ExecContext(ctx, query, day)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
