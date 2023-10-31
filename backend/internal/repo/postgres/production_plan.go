package postgres

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

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
	GetByPeriod(context.Context, models.Period, string) ([]models.ProductionPlan, error)
	CreateSeveral(context.Context, []models.ProductionPlan) error
	DeleteByDate(context.Context, string, string) error
}

func (r *ProductionPlanRepo) GetByPeriod(ctx context.Context, period models.Period, typePlan string) (plan []models.ProductionPlan, err error) {
	args := make([]interface{}, 0)
	condition := "date=$1 AND type=$2"
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
		condition = "date>=$1 AND date<=$2 AND type=$3"
	}
	args = append(args, typePlan)

	query := fmt.Sprintf(`SELECT pp.id, date, product, money, quantity, type FROM %s as pp
		INNER JOIN %s AS p ON product=p.title WHERE %s ORDER BY date, p.count`,
		ProductionPlanTable, ProductsTable, condition,
	)

	if err := r.db.Select(&plan, query, args...); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, rc := range plan {
		date, err := strconv.Atoi(rc.Date)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}

		dateUnix := time.Unix(int64(date), 0)
		plan[i].Date = dateUnix.Format("02.01.2006")
	}

	return plan, nil
}

func (r *ProductionPlanRepo) CreateSeveral(ctx context.Context, plan []models.ProductionPlan) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, date, type, product, money, quantity) VALUES `, ProductionPlanTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(plan))

	date, err := time.Parse("02.01.2006", plan[0].Date)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	c := 6
	for i, f := range plan {
		id := uuid.New()
		values = append(values, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d, $%d)", i*c+1, i*c+2, i*c+3, i*c+4, i*c+5, i*c+6))
		args = append(args, id, fmt.Sprintf("%d", date.Unix()), f.Type, f.Product, f.Money, f.Quantity)
	}
	query += strings.Join(values, ", ")

	_, err = r.db.Exec(query, args...)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ProductionPlanRepo) DeleteByDate(ctx context.Context, date string, typePlan string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date=$1 AND type=$2`, ProductionPlanTable)

	d, err := time.Parse("02.01.2006", date)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, fmt.Sprintf("%d", d.Unix()), typePlan)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
