package middleware

import (
	"github.com/Alexander272/data_center/backend/internal/casbin"
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/pkg/auth"
	// "github.com/casbin/casbin/v2"
)

type Middleware struct {
	// enforcer   casbin.IEnforcer
	permissions casbin.Casbin
	keycloak    *auth.KeycloakClient
	services    *services.Services
	auth        config.AuthConfig
}

func NewMiddleware(services *services.Services, auth config.AuthConfig, permissions casbin.Casbin, keycloak *auth.KeycloakClient) *Middleware {
	return &Middleware{
		permissions: permissions,
		keycloak:    keycloak,
		services:    services,
		auth:        auth,
	}
}
