package middleware

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

func (m *Middleware) VerifyToken(c *gin.Context) {
	tokenInHeader := c.GetHeader("Authorization")
	tokenInCookie, _ := c.Cookie(m.CookieName)

	if tokenInHeader == "" && tokenInCookie == "" {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty token", "user is not authorized")
		return
	}

	token := tokenInCookie
	if tokenInHeader != "" {
		token = strings.Replace(tokenInHeader, "Bearer ", "", 1)
	}

	result, err := m.Keycloak.Client.RetrospectToken(c, token, m.Keycloak.ClientId, m.Keycloak.ClientSecret, m.Keycloak.Realm)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "user in not authorized")
		return
	}

	logger.Debug("result ", result)

	if !*result.Active {
		// TODO если он протух надо пробовать его обновлять

		response.NewErrorResponse(c, http.StatusUnauthorized, "Invalid or expired Token", "user in not authorized")
		return
	}

	// m.Keycloak.Client.RefreshToken()

	jwt, claims, err := m.Keycloak.Client.DecodeAccessToken(c, token, m.Keycloak.Realm)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "user in not authorized")
		return
	}

	logger.Debug(" ")
	logger.Debug("jwt ", jwt)
	logger.Debug(" ")
	logger.Debug("claims ", claims)

	c.Next()
}
