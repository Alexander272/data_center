package v1

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/auth"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/complete"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/orders_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/output_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/production_load"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/production_plan"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/shipment_plan"
	"github.com/gin-gonic/gin"
)

const CookieName = "data_center_session"

type Handler struct {
	services   *services.Services
	auth       config.AuthConfig
	middleware *middleware.Middleware
	cookieName string
}

func NewHandler(services *services.Services, auth config.AuthConfig, middleware *middleware.Middleware) *Handler {
	middleware.CookieName = CookieName

	return &Handler{
		services:   services,
		auth:       auth,
		middleware: middleware,
		cookieName: CookieName,
	}
}

func (h *Handler) Init(api *gin.RouterGroup) {
	v1 := api.Group("/v1")
	{
		v1.GET("/", h.notImplemented)
	}

	auth.Register(v1, h.services.Session, h.auth, h.cookieName)

	criterionsGroup := v1.Group("/criterions", h.middleware.VerifyToken, h.middleware.CheckPermissions)
	criterions.Register(criterionsGroup, h.services.Criterions)
	complete.Register(criterionsGroup, h.services.CompleteCriterion)

	output_volume.Register(criterionsGroup, h.services.OutputVolume)
	shipment_plan.Register(criterionsGroup, h.services.ShipmentPlan)
	orders_volume.Register(criterionsGroup, h.services.OrdersVolume)
	production_load.Register(criterionsGroup, h.services.ProductionLoad)
	production_plan.Register(criterionsGroup, h.services.ProductionPlan)
}

func (h *Handler) notImplemented(c *gin.Context) {
	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
}
