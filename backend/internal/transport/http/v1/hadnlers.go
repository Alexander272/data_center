package v1

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/auth"
	"github.com/Alexander272/data_center/backend/internal/transport/http/v1/criterions/pdd/output"
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

	auth.Register(v1, h.services.Session, h.auth, h.cookieName)

	criterions := v1.Group("/criterions", h.middleware.VerifyToken, h.middleware.CheckPermissions)
	output.Register(criterions)
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

// func (h *Handler) getSession(c *gin.Context) {
// 	keycloak := h.middleware.Keycloak
// 	keycloak.Client.GetUserSessions(c, )
// }

func (h *Handler) test(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"Message": "Success"})
}
