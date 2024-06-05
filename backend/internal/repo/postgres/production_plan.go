package postgres

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type ProductionPlanRepo struct {
	db *sqlx.DB
}

func NewProductionPlanRepo(db *sqlx.DB) *ProductionPlanRepo {
	return &ProductionPlanRepo{
		db: db,
	}
}

type ProductionPlan interface {
	GetByPeriod(context.Context, *models.Period, string) ([]*models.ProductionPlan, error)
	CreateSeveral(context.Context, []*models.ProductionPlan) error
	DeleteByDate(context.Context, string, string) error
}

func (r *ProductionPlanRepo) GetByPeriod(ctx context.Context, req *models.Period, typePlan string) ([]*models.ProductionPlan, error) {
	condition := "date=$1 AND type=$2"
	args := []interface{}{req.From}
	if req.To != "" {
		condition = "date>=$1 AND date<=$2 AND type=$3"
		args = append(args, req.To)
	}
	args = append(args, typePlan)

	query := fmt.Sprintf(`SELECT pp.id, date, product, money, quantity, type FROM %s as pp
		INNER JOIN %s AS p ON product=p.title WHERE %s ORDER BY date, p.count`,
		ProductionPlanTable, ProductsTable, condition,
	)
	plan := []*models.ProductionPlan{}

	if err := r.db.SelectContext(ctx, &plan, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	return plan, nil
}

func (r *ProductionPlanRepo) CreateSeveral(ctx context.Context, dto []*models.ProductionPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, type, product, money, quantity) VALUES `, ProductionPlanTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(dto))

	c := 6
	for i, f := range dto {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6))
		args = append(args, id, f.Date, f.Type, f.Product, f.Money, f.Quantity)
	}
	query += strings.Join(values, ", ")

	_, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ProductionPlanRepo) DeleteByDate(ctx context.Context, date string, typePlan string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1 AND type=$2`, ProductionPlanTable)

	_, err := r.db.ExecContext(ctx, query, date, typePlan)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
