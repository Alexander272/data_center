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

type ShipmentRepo struct {
	db *sqlx.DB
}

func NewShipmentRepo(db *sqlx.DB) *ShipmentRepo {
	return &ShipmentRepo{
		db: db,
	}
}

type Shipment interface {
	GetByDay(context.Context, string) ([]models.Shipment, error)
	GetByPeriod(context.Context, models.Period) ([]models.Shipment, error)
	Create(context.Context, models.Shipment) error
	CreateSeveral(context.Context, []models.Shipment) error
	DeleteByDay(context.Context, string) error
}

func (r *ShipmentRepo) GetByDay(ctx context.Context, day string) (shipment []models.Shipment, err error) {
	query := fmt.Sprintf(`SELECT s.id, day, product, s.count, money FROM %s as s
		INNER JOIN %s AS p ON product=p.title WHERE day=$1 ORDER BY p.count`,
		ShipmentTable, ProductsTable,
	)

	d, err := time.Parse("02.01.2006", day)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&shipment, query, fmt.Sprintf("%d", d.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, rc := range shipment {
		date, err := strconv.Atoi(rc.Day)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}

		dateUnix := time.Unix(int64(date), 0)
		shipment[i].Day = dateUnix.Format("02.01.2006")
	}

	return shipment, nil
}

func (r *ShipmentRepo) GetByPeriod(ctx context.Context, period models.Period) (shipment []models.Shipment, err error) {
	from, err := time.Parse("02.01.2006", period.From)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}
	to, err := time.Parse("02.01.2006", period.To)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	query := fmt.Sprintf(`SELECT s.id, day, product, s.count, money FROM %s as s
 		INNER JOIN %s AS p ON product=p.title WHERE day>=$1 AND day<=$2 ORDER BY day, p.count`,
		ShipmentTable, ProductsTable,
	)

	if err := r.db.Select(&shipment, query, fmt.Sprintf("%d", from.Unix()), fmt.Sprintf("%d", to.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, rc := range shipment {
		date, err := strconv.Atoi(rc.Day)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}

		dateUnix := time.Unix(int64(date), 0)
		shipment[i].Day = dateUnix.Format("02.01.2006")
	}

	return shipment, nil
}

func (r *ShipmentRepo) Create(ctx context.Context, shipment models.Shipment) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES ($1, $2, $3, $4, $5)`, ShipmentTable)
	id := uuid.New()

	day, err := time.Parse("02.01.2006", shipment.Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, id, fmt.Sprintf("%d", day.Unix()), shipment.Product, shipment.Count, shipment.Money)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *ShipmentRepo) CreateSeveral(ctx context.Context, shipment []models.Shipment) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, day, product, count, money) VALUES `, ShipmentTable)

	args := make([]interface{}, 0)
	values := make([]string, 0, len(shipment))

	day, err := time.Parse("02.01.2006", shipment[0].Day)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	c := 5
	for i, f := range shipment {
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

func (r *ShipmentRepo) DeleteByDay(ctx context.Context, day string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE day=$1`, ShipmentTable)

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
