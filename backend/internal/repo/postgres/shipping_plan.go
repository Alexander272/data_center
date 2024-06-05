package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ShippingPlanRepo struct {
	db *sqlx.DB
}

func NewShippingPlanRepo(db *sqlx.DB) *ShippingPlanRepo {
	return &ShippingPlanRepo{
		db: db,
	}
}

type ShippingPlan interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.ShippingPlan, error)
	Create(context.Context, *models.ShippingPlan) error
	UpdateByDay(context.Context, *models.ShippingPlan) error
	DeleteByDay(context.Context, string) error
}

func (r *ShippingPlanRepo) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.ShippingPlan, error) {
	condition := "date=$1"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2"
		args = append(args, req.To)
	}

	query := fmt.Sprintf(`SELECT id, date, number_of_orders, sum_money, quantity FROM %s WHERE %s ORDER BY date`, ShippingPlanTable, condition)
	plan := []*models.ShippingPlan{}

	if err := r.db.SelectContext(ctx, &plan, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return plan, nil
}

func (r *ShippingPlanRepo) Create(ctx context.Context, dto *models.ShippingPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, number_of_orders, sum_money, quantity) VALUES ($1, $2, $3, $4, $5)`, ShippingPlanTable)
	id := uuid.New()

	_, err := r.db.ExecContext(ctx, query, id, dto.Date, dto.NumberOfOrders, dto.SumMoney, dto.Quantity)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShippingPlanRepo) UpdateByDay(ctx context.Context, dto *models.ShippingPlan) error {
	query := fmt.Sprintf(`UPDATE %s SET number_of_orders=$1, sum_money=$2, quantity=$3 WHERE date=$4`, ShippingPlanTable)

	_, err := r.db.ExecContext(ctx, query, dto.NumberOfOrders, dto.SumMoney, dto.Quantity, dto.Date)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShippingPlanRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1`, ShippingPlanTable)

	_, err := r.db.ExecContext(ctx, query, day)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
