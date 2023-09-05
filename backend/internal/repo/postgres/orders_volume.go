package postgres

import (
	"context"
	"fmt"
	"time"

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
	GetByDay(context.Context, string) ([]models.OrdersVolume, error)
	Create(context.Context, models.OrdersVolume) error
	UpdateByDay(context.Context, models.OrdersVolume) error
	DeleteByDay(context.Context, string) error
}

func (r *OrdersVolumeRepo) GetByDay(ctx context.Context, day string) (orders []models.OrdersVolume, err error) {
	query := fmt.Sprintf(`SELECT id, day, number_of_orders, sum_money, quantity FROM %s WHERE day=$1`, OrdersVolumeTable)

	d, err := time.Parse("02.01.2006", day)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&orders, query, fmt.Sprintf("%d", d.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return orders, nil
}

func (r *OrdersVolumeRepo) Create(ctx context.Context, order models.OrdersVolume) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, number_of_orders, sum_money, quantity) VALUES ($1, $2, $3, $4, $5)`, OrdersVolumeTable)
	id := uuid.New()

	day, err := time.Parse("02.01.2006", order.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, id, fmt.Sprintf("%d", day.Unix()), order.NumberOfOrders, order.SumMoney, order.Quantity)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrdersVolumeRepo) UpdateByDay(ctx context.Context, order models.OrdersVolume) error {
	query := fmt.Sprintf(`UPDATE %s SET number_of_orders=$1, sum_money=$2, quantity=$3 WHERE day=$4`, OrdersVolumeTable)

	day, err := time.Parse("02.01.2006", order.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, order.NumberOfOrders, order.SumMoney, order.Quantity, fmt.Sprintf("%d", day.Unix()))
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *OrdersVolumeRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, OrdersVolumeTable)

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
