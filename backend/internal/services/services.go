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
	SemiFinished
	Tooling

	Role
	MenuItem
	Menu
	Session
	Permission
	// User
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
	menuItem := NewMenuItemService(deps.Repos.MenuItem)
	menu := NewMenuService(deps.Repos.Menu, menuItem)
	role := NewRoleService(deps.Repos.Role)
	permission := NewPermissionService("configs/privacy.conf", menu, role)
	// user := NewUserService(deps.Repos.User)

	session := NewSessionService(role, deps.Keycloak)

	ordersVolume := NewOrdersVolumeService(deps.Repos.OrdersVolume)
	shipment := NewShipmentService(deps.Repos.Shipment)
	outputVolume := NewOutputVolumeService(deps.Repos.OutputVolume)
	productionLoad := NewProductionLoadService(deps.Repos.ProductionLoad)
	productionPlan := NewProductionPlanService(deps.Repos.ProductionPlan)
	shippingPlan := NewShippingService(deps.Repos.ShippingPlan)
	semiFinished := NewSemiFinishedService(deps.Repos.SemiFinished)
	tooling := NewToolingService(deps.Repos.Tooling)

	criterions := NewCriterionsService(deps.Repos.Criterions, role)
	completeCriterion := NewCompleteCriterionService(deps.Repos.CompleteCriterion, role, criterions)

	return &Services{
		Shipment:       shipment,
		OrdersVolume:   ordersVolume,
		OutputVolume:   outputVolume,
		ProductionLoad: productionLoad,
		ProductionPlan: productionPlan,
		ShippingPlan:   shippingPlan,
		SemiFinished:   semiFinished,
		Tooling:        tooling,

		Criterions:        criterions,
		CompleteCriterion: completeCriterion,

		MenuItem:   menuItem,
		Menu:       menu,
		Role:       role,
		Session:    session,
		Permission: permission,
		// User:    user,
	}
}
