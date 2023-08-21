package v1

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
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

func (h *Handler) Init(api *gin.RouterGroup) {
	v1 := api.Group("/v1")
	{
		v1.GET("/", h.notImplemented)

		v1.POST("/sign-in", h.signIn)
		v1.GET("/test", h.middleware.VerifyToken, h.test)
	}
}

func (h *Handler) notImplemented(c *gin.Context) {
	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
}

func (h *Handler) signIn(c *gin.Context) {
	var req models.SignIn
	if err := c.BindJSON(&req); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Введены некорректные данные")
		return
	}

	keycloak := h.middleware.Keycloak
	token, err := keycloak.Client.Login(c, keycloak.ClientId, keycloak.ClientSecret, keycloak.Realm, req.UserName, req.Password)
	if err != nil {
		response.NewErrorResponse(c, http.StatusForbidden, err.Error(), "access denied")
		return
	}

	c.JSON(http.StatusOK, token)
}

func (h *Handler) test(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"Message": "Success"})
}
