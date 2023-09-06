package repo

import (
	"github.com/Alexander272/data_center/backend/internal/repo/postgres"
	"github.com/Alexander272/data_center/backend/internal/repo/redis_db"
	"github.com/go-redis/redis/v8"
	"github.com/jmoiron/sqlx"
)

type Criterions interface {
	postgres.Criterions
}
type CompleteCriterion interface {
	postgres.CompleteCriterion
}
type OrdersVolume interface {
	postgres.OrdersVolume
}
type ShipmentPlan interface {
	postgres.ShipmentPlan
}
type OutputVolume interface {
	postgres.OutputVolume
}

type Menu interface {
	postgres.Menu
}
type Role interface {
	postgres.Role
}
type User interface {
	postgres.User
}
type Session interface {
	redis_db.Session
}

type Repo struct {
	Criterions
	CompleteCriterion
	OrdersVolume
	ShipmentPlan
	OutputVolume

	Session
	Menu
	Role
	User
}

func NewRepo(db *sqlx.DB, redis redis.Cmdable) *Repo {
	return &Repo{
		Criterions:        postgres.NewCriterionsRepo(db),
		CompleteCriterion: postgres.NewCompleteCriterionRepo(db),
		OrdersVolume:      postgres.NewOrdersVolumeRepo(db),
		ShipmentPlan:      postgres.NewShipmentPlanRepo(db),
		OutputVolume:      postgres.NewOutputVolumeRepo(db),

		Session: redis_db.NewSessionRepo(redis),
		Menu:    postgres.NewMenuRepo(db),
		Role:    postgres.NewRoleRepo(db),
		User:    postgres.NewUserRepo(db),
	}
}
