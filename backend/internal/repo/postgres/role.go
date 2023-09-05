package postgres

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type RoleRepo struct {
	db *sqlx.DB
}

func NewRoleRepo(db *sqlx.DB) *RoleRepo {
	return &RoleRepo{db: db}
}

type Role interface {
	GetAll(context.Context) ([]models.Role, error)
	Create(context.Context, models.RoleDTO) error
	Update(context.Context, models.RoleDTO) error
	Delete(context.Context, string) error
}

type RoleWithMenu struct {
	Id     string `db:"id"`
	Name   string `db:"name"`
	Type   string `db:"type"`
	Path   string `db:"path"`
	Method string `db:"method"`
}

func (r *RoleRepo) GetAll(ctx context.Context) (roles []models.Role, err error) {
	query := fmt.Sprintf(`SELECT r.id, r.name, type, path, method
		FROM %s AS r INNER JOIN %s AS m ON m.role_id=r.id WHERE is_show=true AND type=$1 ORDER BY r.id`,
		RoleTable, MenuTable,
	)
	var data []RoleWithMenu

	if err := r.db.Select(&data, query, "API"); err != nil {
		return nil, fmt.Errorf("failed to execute query. error: %w", err)
	}

	for i, rwm := range data {
		menu := models.Menu{
			Type:   rwm.Name,
			Path:   rwm.Path,
			Method: rwm.Method,
		}

		if i == 0 || roles[len(roles)-1].Id != rwm.Id {
			roles = append(roles, models.Role{
				Id:    rwm.Id,
				Name:  rwm.Name,
				Menus: []models.Menu{menu},
			})
		} else {
			roles[len(roles)-1].Menus = append(roles[len(roles)-1].Menus, menu)
		}
	}

	return roles, nil
}

func (r *RoleRepo) Create(ctx context.Context, role models.RoleDTO) error {
	query := fmt.Sprintf(`INSERT INTO %s(id, name) VALUES ($1, $2)`, RoleTable)
	id := uuid.New()

	_, err := r.db.Exec(query, id, role.Name)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *RoleRepo) Update(ctx context.Context, role models.RoleDTO) error {
	query := fmt.Sprintf(`UPDATE %s SET name=$1 WHERE id=$2`, RoleTable)

	_, err := r.db.Exec(query, role.Name, role.Id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}

func (r *RoleRepo) Delete(ctx context.Context, id string) error {
	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, RoleTable)

	_, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to execute query. error: %w", err)
	}
	return nil
}
