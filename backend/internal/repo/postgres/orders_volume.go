package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type OrdersVolumeRepo struct {
	db *sqlx.DB
}

func NewOrdersVolumeRepo(db *sqlx.DB) *OrdersVolumeRepo {
	return &OrdersVolumeRepo{
		db: db,
	}
}

type OrdersVolume interface {
	GetByDay(context.Context, string) ([]*models.OrdersVolume, error)
	GetByPeriod(context.Context, *models.Period) ([]*models.OrdersVolume, error)
	Create(context.Context, *models.OrdersVolume) error
	UpdateByDay(context.Context, *models.OrdersVolume) error
	DeleteByDay(context.Context, string) error
}

func (r *OrdersVolumeRepo) GetByDay(ctx context.Context, day string) ([]*models.OrdersVolume, error) {
	query := fmt.Sprintf(`SELECT id, date, number_of_orders, sum_money, quantity FROM %s WHERE date=$1`, OrdersVolumeTable)
	orders := []*models.OrdersVolume{}

	if err := r.db.SelectContext(ctx, &orders, query, day); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return orders, nil
}

func (r *OrdersVolumeRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.OrdersVolume, error) {
	query := fmt.Sprintf(`SELECT id, date, number_of_orders, sum_money, quantity FROM %s WHERE date>=$1 AND date<=$2 ORDER BY date`, OrdersVolumeTable)
	orders := []*models.OrdersVolume{}

	if err := r.db.SelectContext(ctx, &orders, query, req.From, req.To); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return orders, nil
}

func (r *OrdersVolumeRepo) Create(ctx context.Context, dto *models.OrdersVolume) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, number_of_orders, sum_money, quantity) VALUES ($1, $2, $3, $4, $5)`, OrdersVolumeTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Date, dto.NumberOfOrders, dto.SumMoney, dto.Quantity)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrdersVolumeRepo) UpdateByDay(ctx context.Context, dto *models.OrdersVolume) error {
	query := fmt.Sprintf(`UPDATE %s SET number_of_orders=$1, sum_money=$2, quantity=$3 WHERE date=$4`, OrdersVolumeTable)

	_, err := r.db.ExecContext(ctx, query, dto.NumberOfOrders, dto.SumMoney, dto.Quantity, dto.Date)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrdersVolumeRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, OrdersVolumeTable)

	_, err := r.db.ExecContext(ctx, query, day)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
