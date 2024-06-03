package middleware

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/constants"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/gin-gonic/gin"
)

func (m *Middleware) VerifyToken(c *gin.Context) {
	// tokenInHeader := c.GetHeader("Authorization")
	// tokenInCookie, _ := c.Cookie(m.CookieName)

	// if tokenInHeader == "" && tokenInCookie == "" {
	// 	response.NewErrorResponse(c, http.StatusUnauthorized, "empty token", "сессия не найдена")
	// 	return
	// }

	// token := tokenInCookie
	// if tokenInHeader != "" {
	// 	token = strings.Replace(tokenInHeader, "Bearer ", "", 1)
	// }

	token := strings.Replace(c.GetHeader("Authorization"), "Bearer ", "", 1)

	result, err := m.keycloak.Client.RetrospectToken(c, token, m.keycloak.ClientId, m.keycloak.ClientSecret, m.keycloak.Realm)
	if err != nil {
		domain := m.auth.Domain
		if !strings.Contains(c.Request.Host, domain) {
			domain = c.Request.Host
		}

		c.SetCookie(constants.AuthCookie, "", -1, "/", domain, m.auth.Secure, true)
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "сессия не найдена")
		return
	}

	//? При одновременных запросах с просроченным токеном, оба запроса обновляют токен, а сохраняется один => при следующий запросах пользователя выкинет из системы

	// result.Jti
	// logger.Debug("result ", result)

	if !*result.Active {
		response.NewErrorResponse(c, http.StatusUnauthorized, "token is not active", "время сессии истекло, повторите вход")
		return

		// если он протух надо пробовать его обновлять
		// _, token, err = m.services.Session.Refresh(c, token)
		// if err != nil {
		// 	c.SetCookie(m.CookieName, "", -1, "/", c.Request.Host, m.auth.Secure, true)
		// 	response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "не удалось обновить сессию")
		// 	return
		// }

		// c.SetCookie(m.CookieName, token, int(m.auth.RefreshTokenTTL.Seconds()), "/", m.auth.Domain, m.auth.Secure, true)

		// response.NewErrorResponse(c, http.StatusUnauthorized, "Invalid or expired Token", "user in not authorized")
		// return
	}

	// m.Keycloak.Client.RefreshToken()

	// jwt, claims, err := m.Keycloak.Client.DecodeAccessToken(c, token, m.Keycloak.Realm)
	user, err := m.services.Session.DecodeToken(c, token)
	if err != nil {
		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "токен доступа не валиден")
		return
	}

	// logger.Debug(user)
	c.Set(constants.CtxUser, *user)

	// logger.Debug(" ")
	// logger.Debug("jwt ", jwt)
	// logger.Debug(" ")
	// logger.Debug("claims ", claims)

	c.Next()
}
