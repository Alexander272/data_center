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
	GetAll(ctx context.Context) ([]models.Menu, error)
	GetByRole(context.Context, string) ([]models.Menu, error)
}

func (r *MenuRepo) GetAll(ctx context.Context) (menus []models.Menu, err error) {
	query := fmt.Sprintf(`SELECT id, name, type, path, method, is_show	FROM %s ORDER BY role_id, type`, MenuTable)

	if err := r.db.Select(&menus, query); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return menus, nil
}

func (r *MenuRepo) GetByRole(ctx context.Context, role string) (menus []models.Menu, err error) {
	query := fmt.Sprintf(`SELECT m.id, m.name, type, path, method, is_show, description FROM %s AS m 
		INNER JOIN %s AS r ON r.id=role_id WHERE r.name=$1 AND type=$2 AND is_show=true ORDER BY type`,
		MenuTable, RoleTable,
	)

	if err := r.db.Select(&menus, query, role, "APP"); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return menus, nil
}
