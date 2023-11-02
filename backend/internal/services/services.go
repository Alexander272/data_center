package services

import (
	"time"

	"github.com/Alexander272/data_center/backend/internal/repo"
	"github.com/Alexander272/data_center/backend/pkg/auth"
	"github.com/Alexander272/data_center/backend/pkg/hasher"
)

type Services struct {
	Criterions
	CompleteCriterion
	OrdersVolume
	Shipment
	OutputVolume
	ProductionLoad
	ProductionPlan
	ShippingPlan

	Session
	Role
	User
}

type Deps struct {
	Repos           *repo.Repo
	Keycloak        *auth.KeycloakClient
	Hasher          hasher.PasswordHasher
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	// TokenManager    auth.TokenManager
}

func NewServices(deps Deps) *Services {
	menu := NewMenuService(deps.Repos.Menu)
	role := NewRoleService(deps.Repos.Role)
	user := NewUserService(deps.Repos.User)

	session := NewSessionService(menu, deps.Keycloak)

	ordersVolume := NewOrdersVolumeService(deps.Repos.OrdersVolume)
	shipment := NewShipmentService(deps.Repos.Shipment)
	outputVolume := NewOutputVolumeService(deps.Repos.OutputVolume)
	productionLoad := NewProductionLoadService(deps.Repos.ProductionLoad)
	productionPlan := NewProductionPlanService(deps.Repos.ProductionPlan)
	shippingPlan := NewShippingService(deps.Repos.ShippingPlan)

	criterionDeps := CriterionDeps{
		// shipment: shipmentPlan,
		// orders:   ordersVolume,
		// output:   outputVolume,
		// load:     productionLoad,
	}

	criterions := NewCriterionsService(deps.Repos.Criterions, criterionDeps)
	completeCriterion := NewCompleteCriterionService(deps.Repos.CompleteCriterion)

	return &Services{
		Shipment:          shipment,
		OrdersVolume:      ordersVolume,
		OutputVolume:      outputVolume,
		ProductionLoad:    productionLoad,
		ProductionPlan:    productionPlan,
		ShippingPlan:      shippingPlan,
		Criterions:        criterions,
		CompleteCriterion: completeCriterion,

		Session: session,
		Role:    role,
		User:    user,
	}
}
