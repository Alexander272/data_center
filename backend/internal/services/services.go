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
	ShipmentPlan
	OutputVolume

	Session
	Role
	User
}

type Deps struct {
	Repos           *repo.Repo
	TokenManager    auth.TokenManager
	Keycloak        *auth.KeycloakClient
	Hasher          hasher.PasswordHasher
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func NewServices(deps Deps) *Services {
	menu := NewMenuService(deps.Repos.Menu)
	role := NewRoleService(deps.Repos.Role)
	user := NewUserService(deps.Repos.User)

	session := NewSessionService(deps.Repos.Session, menu, deps.Keycloak, deps.TokenManager, deps.AccessTokenTTL, deps.RefreshTokenTTL)

	ordersVolume := NewOrdersVolumeService(deps.Repos.OrdersVolume)
	shipmentPlan := NewShipmentPlanService(deps.Repos.ShipmentPlan)
	outputVolume := NewOutputVolumeService(deps.Repos.OutputVolume)

	criterionDeps := CriterionDeps{
		shipment: shipmentPlan,
		orders:   ordersVolume,
		output:   outputVolume,
	}

	criterions := NewCriterionsService(deps.Repos.Criterions, criterionDeps)
	completeCriterion := NewCompleteCriterionService(deps.Repos.CompleteCriterion)

	return &Services{
		ShipmentPlan:      shipmentPlan,
		OrdersVolume:      ordersVolume,
		OutputVolume:      outputVolume,
		Criterions:        criterions,
		CompleteCriterion: completeCriterion,

		Session: session,
		Role:    role,
		User:    user,
	}
}
