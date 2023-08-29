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
	GetByDay(context.Context, string) ([]models.OrdersVolume, error)
	Create(context.Context, models.OrdersVolume) error
}

func (r *OrdersVolumeRepo) GetByDay(ctx context.Context, day string) (orders []models.OrdersVolume, err error) {
	query := fmt.Sprintf(`SELECT id, day, number_of_orders, sum_money, quantity FROM %s WHERE day=$1`, OrdersVolumeTable)

	if err := r.db.Select(&orders, query, day); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return orders, nil
}

func (r *OrdersVolumeRepo) Create(ctx context.Context, order models.OrdersVolume) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, number_of_orders, sum_money, quantity) VALUES ($1, $2, $3, $4, $5)`, OrdersVolumeTable)
	id := uuid.New()

	_, err := r.db.Exec(query, id, order.Day, order.NumberOfOrders, order.SumMoney, order.Quantity)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
