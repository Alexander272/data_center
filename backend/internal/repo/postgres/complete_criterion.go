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

type CompleteCriterionRepo struct {
	db *sqlx.DB
}

func NewCompleteCriterionRepo(db *sqlx.DB) *CompleteCriterionRepo {
	return &CompleteCriterionRepo{
		db: db,
	}
}

type CompleteCriterion interface {
	Get(context.Context, models.ReportFilter) ([]models.ReportComplete, error)
	Create(context.Context, models.CompleteCriterion) error
	DeleteOld(ctx context.Context, lastDate string) error
}

func (r *CompleteCriterionRepo) Get(ctx context.Context, filter models.ReportFilter) (complete []models.ReportComplete, err error) {
	query := fmt.Sprintf(`SELECT date, CASE WHEN COUNT(criterion_id) = (SELECT COUNT(id) FROM %s AS m
		WHERE method LIKE '%%(POST)|(PUT)|(DELETE)' AND m.type='API' AND m.role_id=c.role_id
		) THEN true ELSE false END AS complete
		FROM %s AS c
		INNER JOIN %s AS r ON r.id=c.role_id
		GROUP BY role_id, name, date, type 
		HAVING type=$1 AND r.name=$2 AND date>=$3 LIMIT 7`,
		MenuTable, CompleteCriterionTable, RoleTable,
	)

	date, err := time.Parse("02.01.2006", filter.LastDate)
	if err != nil {
		return nil, fmt.Errorf("failed to parse date. error: %w", err)
	}

	if err := r.db.Select(&complete, query, filter.Type, filter.Role, fmt.Sprintf("%d", date.Unix())); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, rc := range complete {
		date, err := strconv.Atoi(rc.Date)
		if err != nil {
			return nil, fmt.Errorf("failed to parse date. error: %w", err)
		}

		dateUnix := time.Unix(int64(date), 0)
		complete[i].Date = dateUnix.Format("02.01.2006")
	}

	return complete, nil
}

func (r *CompleteCriterionRepo) Create(ctx context.Context, criterion models.CompleteCriterion) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, role_id, type, date, criterion_id) 
		VALUES ($1, (SELECT id FROM %s WHERE name=$2 LIMIT 1), $3,  $4, $5)`,
		CompleteCriterionTable, RoleTable,
	)
	id := uuid.New()

	//? если период равен месяцу можно парсить его по примеру time.Parse("01.2006", "09.2023")

	date, err := time.Parse("02.01.2006", criterion.Date)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, id, criterion.Role, criterion.Type, fmt.Sprintf("%d", date.Unix()), criterion.CriterionId)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *CompleteCriterionRepo) DeleteOld(ctx context.Context, lastDate string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE date<$1`, CompleteCriterionTable)

	date, err := time.Parse("02.01.2006", lastDate)
	if err != nil {
		return fmt.Errorf("failed to parse date. error: %w", err)
	}

	_, err = r.db.Exec(query, fmt.Sprintf("%d", date.Unix()))
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
