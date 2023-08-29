package postgres

import (
	"context"
	"fmt"
	"strings"

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
	Create(context.Context, models.ShipmentPlan) error
	CreateSeveral(context.Context, []models.ShipmentPlan) error
}

func (r *ShipmentPlanRepo) GetByDay(ctx context.Context, day string) (plan []models.ShipmentPlan, err error) {
	query := fmt.Sprintf(`SELECT id, day, product, count, money FROM %s WHERE day=$1`, ShipmentPlanTable)

	if err := r.db.Select(&plan, query, day); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return plan, nil
}

func (r *ShipmentPlanRepo) Create(ctx context.Context, plan models.ShipmentPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES ($1, $2, $3, $4, $5)`, ShipmentPlanTable)
	id := uuid.New()

	_, err := r.db.Exec(query, id, plan.Day, plan.Product, plan.Count, plan.Money)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentPlanRepo) CreateSeveral(ctx context.Context, plan []models.ShipmentPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES `, ShipmentPlanTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(plan))

	c := 5
	for i, f := range plan {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5))
		args = append(args, id, f.Day, f.Product, f.Count, f.Money)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
