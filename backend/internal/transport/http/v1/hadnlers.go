package v1

import (
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/api"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/auth"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/complete"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/orders_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/output_volume"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/production_load"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/production_plan"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/shipment"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/shipping_plan"
	"github.com/gin-gonic/gin"
)

const CookieName = "sealur_internal_session"

type Handler struct {
	services   *services.Services
	auth       config.AuthConfig
	bot        config.BotConfig
	middleware *middleware.Middleware
	cookieName string
}

func NewHandler(services *services.Services, auth config.AuthConfig, bot config.BotConfig, middleware *middleware.Middleware) *Handler {
	middleware.CookieName = CookieName

	return &Handler{
		services:   services,
		auth:       auth,
		bot:        bot,
		middleware: middleware,
		cookieName: CookieName,
	}
}

func (h *Handler) Init(group *gin.RouterGroup) {
	botApi := api.NewMostApi(h.bot.Url)

	v1 := group.Group("/v1")
	auth.Register(v1, h.services.Session, h.auth, botApi, h.cookieName)

	criterionsGroup := v1.Group("/criterions", h.middleware.VerifyToken, h.middleware.CheckPermissions)
	criterions.Register(criterionsGroup, h.services.Criterions, botApi)
	complete.Register(criterionsGroup, h.services.CompleteCriterion, botApi)

	output_volume.Register(criterionsGroup, h.services.OutputVolume, botApi)
	shipment.Register(criterionsGroup, h.services.Shipment, botApi)
	orders_volume.Register(criterionsGroup, h.services.OrdersVolume, botApi)
	production_load.Register(criterionsGroup, h.services.ProductionLoad, botApi)
	production_plan.Register(criterionsGroup, h.services.ProductionPlan, botApi)
	shipping_plan.Register(criterionsGroup, h.services.ShippingPlan, botApi)
}

// func (h *Handler) notImplemented(c *gin.Context) {
// 	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
// }
