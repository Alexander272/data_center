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
	// GetAll(ctx context.Context) ([]models.Menu, error)
	// GetByRole(context.Context, string) ([]models.Menu, error)
	GetByRole(context.Context, string) ([]models.MenuByRoleDTO, error)
}

//TODO
/*
	? можно попробовать сгруппировать все API и части APP по модулям, можно сделать так чтобы один модуль мог содержать другой
	эти модули в первую очередь будут определять доступные разделы на клиенте

	criterions -> day/month -> criterion
	graphics ->
*/

// func (r *MenuRepo) GetAll(ctx context.Context) (menus []models.Menu, err error) {
// 	query := fmt.Sprintf(`SELECT id, name, type, path, method, is_show	FROM %s ORDER BY role_id, type`, MenuTable)

// 	if err := r.db.Select(&menus, query); err != nil {
// 		return nil, fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return menus, nil
// }

// func (r *MenuRepo) GetByRole(ctx context.Context, role string) (menus []models.Menu, err error) {
// 	query := fmt.Sprintf(`SELECT m.id, m.name, type, path, method, is_show, description FROM %s AS m
// 		INNER JOIN %s AS r ON r.id=role_id WHERE r.name=$1 AND type=$2 AND is_show=true ORDER BY type`,
// 		MenuTable, RoleTable,
// 	)

// 	if err := r.db.Select(&menus, query, role, "APP"); err != nil {
// 		return nil, fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return menus, nil
// }

func (r *MenuRepo) GetAll(ctx context.Context) (menu []models.Menu, err error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *MenuRepo) GetByRole(ctx context.Context, role string) (menu []models.MenuByRoleDTO, err error) {
	query := fmt.Sprintf(`SELECT m.id, i.name, i.description FROM %s AS m
		LEFT JOIN %s AS r ON r.id=role LEFT JOIN %s AS i ON i.id=menu_item 
		WHERE i.is_show=true AND r.name=$1`,
		MenuByRoleTable, RoleTable, MenuItemTable,
	)

	if err := r.db.Select(&menu, query, role); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}
	return menu, nil
}

// func (r *MenuRepo) Create(ctx context.Context, item models.CreateMenuDTO) error {}
