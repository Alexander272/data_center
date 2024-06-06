package postgres

import (
	"github.com/jmoiron/sqlx"
)

type UserRepo struct {
	db *sqlx.DB
}

func NewUserRepo(db *sqlx.DB) *UserRepo {
	return &UserRepo{db: db}
}

// type User interface {
// 	GetById(context.Context, string) (models.User, error)
// 	GetAll(context.Context) ([]models.UserShort, error)
// 	Create(context.Context, models.UserDTO) error
// 	Update(context.Context, models.UserDTO) error
// 	Delete(context.Context, string) error
// }

// func (r *UserRepo) GetById(ctx context.Context, id string) (u models.User, err error) {
// 	return u, fmt.Errorf("not implemented")
// }

// func (r *UserRepo) GetAll(ctx context.Context) (users []models.UserShort, err error) {
// 	query := fmt.Sprintf(`SELECT u.id, user_name, name as role
// 		FROM %s as u INNER JOIN %s as r ON r.id=role_id WHERE is_disabled=false`,
// 		UsersTable, RoleTable,
// 	)

// 	if err := r.db.Select(&users, query); err != nil {
// 		return nil, fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return users, nil
// }

// func (r *UserRepo) Create(ctx context.Context, user models.UserDTO) error {
// 	query := fmt.Sprintf(`INSERT INTO %s(id, user_name, password, role_id, is_snow_in_list, is_disabled, sector)
// 		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
// 		UsersTable,
// 	)
// 	id := uuid.New()

// 	_, err := r.db.Exec(query, id, user.UserName, user.Password, user.RoleId, user.IsShowInList, user.IsDisabled, user.Sector)
// 	if err != nil {
// 		return fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepo) Update(ctx context.Context, user models.UserDTO) error {
// 	query := fmt.Sprintf(`UPDATE %s SET user_name=$1, password=$2, role_id=$3, is_snow_in_list=$4, is_disabled=$5, sector=$6
// 		WHERE id=$7`,
// 		UsersTable,
// 	)

// 	_, err := r.db.Exec(query, user.UserName, user.Password, user.RoleId, user.IsShowInList, user.IsDisabled, user.Sector, user.Id)
// 	if err != nil {
// 		return fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return nil
// }

// func (r *UserRepo) Delete(ctx context.Context, id string) error {
// 	query := fmt.Sprintf(`DELETE FROM %s WHERE id=$1`, UsersTable)

// 	_, err := r.db.Exec(query, id)
// 	if err != nil {
// 		return fmt.Errorf("failed to execute query. error: %w", err)
// 	}
// 	return nil
// }
