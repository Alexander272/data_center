package http

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/casbin"
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	httpV1 "github.com/Alexander272/data_center/backend/internal/transport/http/v1"
	"github.com/Alexander272/data_center/backend/pkg/auth"
	"github.com/Alexander272/data_center/backend/pkg/limiter"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	// enforcer casbin.IEnforcer
	permissions casbin.Casbin
	keycloak    *auth.KeycloakClient
	services    *services.Services
}

func NewHandler(services *services.Services, permissions casbin.Casbin, keycloak *auth.KeycloakClient) *Handler {
	return &Handler{
		services:    services,
		permissions: permissions,
		keycloak:    keycloak,
	}
}

func (h *Handler) Init(conf *config.Config) *gin.Engine {
	router := gin.Default()

	// router.Use(
	// 	limiter.Limit(conf.Limiter.RPS, conf.Limiter.Burst, conf.Limiter.TTL),
	// )

	router.Use(
		static.Serve("/", static.LocalFile("../frontend/dist/", true)),
		limiter.Limit(conf.Limiter.RPS, conf.Limiter.Burst, conf.Limiter.TTL),
	)

	// Init router
	router.GET("/api/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	h.initAPI(router, conf.Auth)

	return router
}

func (h *Handler) initAPI(router *gin.Engine, auth config.AuthConfig) {
	handlerV1 := httpV1.NewHandler(h.services, auth, middleware.NewMiddleware(h.services, auth, h.permissions, h.keycloak))
	api := router.Group("/api")
	{
		handlerV1.Init(api)
	}
}
