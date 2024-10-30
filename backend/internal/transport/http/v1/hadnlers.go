package v1

import (
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/auth"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/complete"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/orders_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/output_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/production_load"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/production_plan"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/quality"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/safety"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/semi_finished"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/shipment"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/shipping_plan"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/tooling"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services   *services.Services
	auth       config.AuthConfig
	middleware *middleware.Middleware
}

func NewHandler(services *services.Services, auth config.AuthConfig, middleware *middleware.Middleware) *Handler {
	return &Handler{
		services:   services,
		auth:       auth,
		middleware: middleware,
	}
}

func (h *Handler) Init(group *gin.RouterGroup) {
	v1 := group.Group("/v1")
	auth.Register(v1, h.services.Session, h.auth)

	criterionsGroup := v1.Group("/criterions", h.middleware.VerifyToken)
	criterions.Register(criterionsGroup, h.services.Criterions, h.middleware)
	complete.Register(criterionsGroup, h.services.CompleteCriterion, h.middleware)

	output_volume.Register(criterionsGroup, h.services.OutputVolume, h.middleware)
	shipment.Register(criterionsGroup, h.services.Shipment, h.middleware)
	orders_volume.Register(criterionsGroup, h.services.OrdersVolume, h.middleware)
	production_load.Register(criterionsGroup, h.services.ProductionLoad, h.middleware)
	production_plan.Register(criterionsGroup, h.services.ProductionPlan, h.middleware)
	shipping_plan.Register(criterionsGroup, h.services.ShippingPlan, h.middleware)
	semi_finished.Register(criterionsGroup, h.services.SemiFinished, h.middleware)
	tooling.Register(criterionsGroup, h.services.Tooling, h.middleware)
	safety.Register(criterionsGroup, h.services.Safety, h.middleware)
	quality.Register(criterionsGroup, h.services.Quality, h.middleware)
}
