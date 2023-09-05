package postgres

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ShipmentPlanRepo struct {
	db *sqlx.DB
}

func NewShipmentPlanRepo(db *sqlx.DB) *ShipmentPlanRepo {
	return &ShipmentPlanRepo{
		db: db,
	}
}

type ShipmentPlan interface {
	GetByDay(context.Context, string) ([]models.ShipmentPlan, error)
	GetByPeriod(context.Context, models.Period) ([]models.ShipmentPlan, error)
	Create(context.Context, models.ShipmentPlan) error
	CreateSeveral(context.Context, []models.ShipmentPlan) error
	DeleteByDay(context.Context, string) error
}

func (r *ShipmentPlanRepo) GetByDay(ctx context.Context, day string) (plan []models.ShipmentPlan, err error) {
	query := fmt.Sprintf(`SELECT id, day, product, count, money FROM %s WHERE day=$1`, ShipmentPlanTable)

	d, err := time.Parse("02.01.2006", day)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&plan, query, fmt.Sprintf("%d", d.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return plan, nil
}

func (r *ShipmentPlanRepo) GetByPeriod(ctx context.Context, period models.Period) (plan []models.ShipmentPlan, err error) {
	from, err := time.Parse("02.01.2006", period.From)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}
	to, err := time.Parse("02.01.2006", period.To)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	query := fmt.Sprintf(`SELECT id, day, product, count, money FROM %s WHERE day>=$1 AND day<$2`, ShipmentPlanTable)

	if err := r.db.Select(&plan, query, fmt.Sprintf("%d", from.Unix()), fmt.Sprintf("%d", to.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return plan, nil
}

func (r *ShipmentPlanRepo) Create(ctx context.Context, plan models.ShipmentPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES ($1, $2, $3, $4, $5)`, ShipmentPlanTable)
	id := uuid.New()

	day, err := time.Parse("02.01.2006", plan.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, id, fmt.Sprintf("%d", day.Unix()), plan.Product, plan.Count, plan.Money)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentPlanRepo) CreateSeveral(ctx context.Context, plan []models.ShipmentPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES `, ShipmentPlanTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(plan))

	day, err := time.Parse("02.01.2006", plan[0].Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	c := 5
	for i, f := range plan {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, fmt.Sprintf("%d", day.Unix()), f.Product, f.Count, f.Money)
	}
	query += strings.Join(values, ", ")

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentPlanRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, ShipmentPlanTable)

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
