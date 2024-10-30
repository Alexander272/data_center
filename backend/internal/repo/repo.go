package repo

import (
	"github.com/Alexander272/data_center/backend/internal/repo/postgres"
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
type Shipment interface {
	postgres.Shipment
}
type OutputVolume interface {
	postgres.OutputVolume
}
type ProductionLoad interface {
	postgres.ProductionLoad
}
type ProductionPlan interface {
	postgres.ProductionPlan
}
type ShippingPlan interface {
	postgres.ShippingPlan
}
type SemiFinished interface {
	postgres.SemiFinished
}
type Tooling interface {
	postgres.Tooling
}
type Safety interface {
	postgres.Safety
}
type Quality interface {
	postgres.Quality
}

type MenuItem interface {
	postgres.MenuItem
}
type Menu interface {
	postgres.Menu
}
type Role interface {
	postgres.Role
}

// type User interface {
// 	postgres.User
// }

type Repo struct {
	Criterions
	CompleteCriterion
	OrdersVolume
	Shipment
	OutputVolume
	ProductionLoad
	ProductionPlan
	ShippingPlan
	SemiFinished
	Tooling
	Safety
	Quality

	MenuItem
	Menu
	Role
	// User
}

func NewRepo(db *sqlx.DB) *Repo {
	return &Repo{
		Criterions:        postgres.NewCriterionsRepo(db),
		CompleteCriterion: postgres.NewCompleteCriterionRepo(db),
		OrdersVolume:      postgres.NewOrdersVolumeRepo(db),
		Shipment:          postgres.NewShipmentRepo(db),
		OutputVolume:      postgres.NewOutputVolumeRepo(db),
		ProductionLoad:    postgres.NewProductionLoadRepo(db),
		ProductionPlan:    postgres.NewProductionPlanRepo(db),
		ShippingPlan:      postgres.NewShippingPlanRepo(db),
		SemiFinished:      postgres.NewSemiFinishedRepo(db),
		Tooling:           postgres.NewTooling(db),
		Safety:            postgres.NewSafetyRepo(db),
		Quality:           postgres.NewQualityRepo(db),

		MenuItem: postgres.NewMenuItemRepo(db),
		Menu:     postgres.NewMenuRepo(db),
		Role:     postgres.NewRoleRepo(db),
		// User:     postgres.NewUserRepo(db),
	}
}
