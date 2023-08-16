package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/jmoiron/sqlx"
)

type MenuRepo struct {
	db *sqlx.DB
}

func NewMenuRepo(db *sqlx.DB) *MenuRepo {
	return &MenuRepo{
		db: db,
	}
}

type Menu interface {
	GetAll(ctx context.Context) (menus []models.Menu, err error)
}

func (r *MenuRepo) GetAll(ctx context.Context) (menus []models.Menu, err error) {
	query := fmt.Sprintf(`SELECT id, name, type, path, method, is_show	FROM %s ORDER BY role_id, type`, MenuTable)

	if err := r.db.Select(&menus, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return menus, nil
}
