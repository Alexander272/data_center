package v1

import (
	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
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

func (h *Handler) Init(api *gin.RouterGroup) {}
