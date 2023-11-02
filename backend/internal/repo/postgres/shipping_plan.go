package postgres

import (
	"context"
	"fmt"
	"strconv"
	"time"

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
	GetByPeriod(context.Context, models.Period) ([]models.ShippingPlan, error)
	Create(context.Context, models.ShippingPlan) error
	UpdateByDay(context.Context, models.ShippingPlan) error
	DeleteByDay(context.Context, string) error
}

func (r *ShippingPlanRepo) GetByPeriod(ctx context.Context, period models.Period) (plan []models.ShippingPlan, err error) {
	args := make([]interface{}, 0)

	condition := "day=$1"
	from, err := time.Parse("02.01.2006", period.From)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}
	args = append(args, fmt.Sprintf("%d", from.Unix()))

	if period.To != "" {
		to, err := time.Parse("02.01.2006", period.To)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}
		args = append(args, fmt.Sprintf("%d", to.Unix()))
		condition = "date>=$1 AND date<=$2"
	}

	query := fmt.Sprintf(`SELECT id, day, number_of_orders, sum_money, quantity FROM %s WHERE %s ORDER BY day`, ShippingPlanTable, condition)

	if err := r.db.Select(&plan, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, sp := range plan {
		date, err := strconv.Atoi(sp.Day)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}

		dateUnix := time.Unix(int64(date), 0)
		plan[i].Day = dateUnix.Format("02.01.2006")
	}

	return plan, nil
}

func (r *ShippingPlanRepo) Create(ctx context.Context, plan models.ShippingPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, number_of_orders, sum_money, quantity) VALUES ($1, $2, $3, $4, $5)`, ShippingPlanTable)
	id := uuid.New()

	day, err := time.Parse("02.01.2006", plan.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, id, fmt.Sprintf("%d", day.Unix()), plan.NumberOfOrders, plan.SumMoney, plan.Quantity)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShippingPlanRepo) UpdateByDay(ctx context.Context, plan models.ShippingPlan) error {
	query := fmt.Sprintf(`UPDATE %s SET number_of_orders=$1, sum_money=$2, quantity=$3 WHERE day=$4`, ShippingPlanTable)

	day, err := time.Parse("02.01.2006", plan.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, plan.NumberOfOrders, plan.SumMoney, plan.Quantity, fmt.Sprintf("%d", day.Unix()))
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShippingPlanRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, ShippingPlanTable)

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
