package middleware

// func (m *Middleware) UserIdentity(c *gin.Context) {
// 	token, err := c.Cookie(m.CookieName)
// 	if err != nil {
// 		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "user is not authorized")
// 		return
// 	}

// 	user, err := m.services.Session.TokenParse(token)
// 	if err != nil {
// 		c.SetCookie(m.CookieName, "", -1, "/", c.Request.Host, m.auth.Secure, true)
// 		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "user is not authorized")
// 		return
// 	}

// 	isRefresh, err := m.services.Session.CheckSession(c, token)
// 	if err != nil {
// 		c.SetCookie(m.CookieName, "", -1, "/", c.Request.Host, m.auth.Secure, true)
// 		response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "user is not authorized")
// 		return
// 	}

// 	if isRefresh {
// 		// _, token, err := m.services.Session.Refresh(c, user)
// 		// if err != nil {
// 		// 	response.NewErrorResponse(c, http.StatusUnauthorized, err.Error(), "failed to refresh session")
// 		// 	return
// 		// }

// 		c.SetCookie(m.CookieName, token, int(m.auth.RefreshTokenTTL.Seconds()), "/", m.auth.Domain, m.auth.Secure, true)
// 	}

// 	c.Set(m.CtxUser, user)

// 	// c.Set(m.UserIdCtx, user.Id)
// 	// c.Set(m.RoleCtx, user.Role.Role)

// 	c.Next()
// }
