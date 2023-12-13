package auth

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/config"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/api"
	"github.com/gin-gonic/gin"
)

type AuthHandlers struct {
	service    services.Session
	auth       config.AuthConfig
	botApi     api.MostBotApi
	cookieName string
}

func NewAuthHandlers(service services.Session, auth config.AuthConfig, botApi api.MostBotApi, cookieName string) *AuthHandlers {
	return &AuthHandlers{
		service:    service,
		auth:       auth,
		botApi:     botApi,
		cookieName: cookieName,
	}
}

func Register(api *gin.RouterGroup, service services.Session, auth config.AuthConfig, botApi api.MostBotApi, cookieName string) {
	handlers := NewAuthHandlers(service, auth, botApi, cookieName)

	authRoute := api.Group("/auth")
	{
		authRoute.POST("/sign-in", handlers.signIn)
		authRoute.POST("/sign-out", handlers.signOut)
		authRoute.POST("/refresh", handlers.refresh)
	}
}

func (h *AuthHandlers) signIn(c *gin.Context) {
	var dto models.SignIn
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Введены некорректные данные")
		return
	}

	user, err := h.service.SignIn(c, dto)
	if err != nil {
		if strings.Contains(err.Error(), "invalid_grant") {
			response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Введены некорректные данные")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}

	domain := h.auth.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	c.SetCookie(h.cookieName, user.RefreshToken, int(h.auth.RefreshTokenTTL.Seconds()), "/", domain, h.auth.Secure, true)
	c.JSON(http.StatusOK, response.DataResponse{Data: user})
}

func (h *AuthHandlers) signOut(c *gin.Context) {
	refreshToken, err := c.Cookie(h.cookieName)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "Сессия не найдена")
		return
	}

	if err := h.service.SignOut(c, refreshToken); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), nil)
		return
	}

	domain := h.auth.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	c.SetCookie(h.cookieName, "", -1, "/", domain, h.auth.Secure, true)
	c.JSON(http.StatusNoContent, response.StatusResponse{})
}

func (h *AuthHandlers) refresh(c *gin.Context) {
	refreshToken, err := c.Cookie(h.cookieName)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "Сессия не найдена")
		return
	}

	user, err := h.service.Refresh(c, refreshToken)
	if err != nil {
		if strings.Contains(err.Error(), models.ErrSessionEmpty.Error()) {
			response.NewErrorResponse(c, http.StatusUnauthorized, "token is expired", "сессия не найдена")
			return
		}
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), nil)
		return
	}

	domain := h.auth.Domain
	if !strings.Contains(c.Request.Host, domain) {
		domain = c.Request.Host
	}

	c.SetCookie(h.cookieName, user.RefreshToken, int(h.auth.RefreshTokenTTL.Seconds()), "/", domain, h.auth.Secure, true)
	c.JSON(http.StatusOK, response.DataResponse{Data: user})
}
