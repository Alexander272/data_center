package middleware

import (
	"github.com/Alexander272/data_center/backend/internal/casbin"
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	// "github.com/casbin/casbin/v2"
)

type Middleware struct {
	CookieName string
	// enforcer   casbin.IEnforcer
	permissions casbin.Casbin
	//TODO стоит наверное получать не все сервисы, а только те что используются
	services *services.Services
	auth     config.AuthConfig
	CtxUser  string
	// CtxRole              string
}

func NewMiddleware(services *services.Services, auth config.AuthConfig, permissions casbin.Casbin) *Middleware {
	return &Middleware{
		// enforcer: enforcer,
		permissions: permissions,
		services:    services,
		auth:        auth,
		CtxUser:     "user_context",
		// UserIdCtx:            "userId",
		// RoleCtx:              "role",
	}
}
