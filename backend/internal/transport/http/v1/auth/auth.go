package auth

// type AuthHandlers_old struct {
// 	service    services.Session
// 	auth       config.AuthConfig
// 	botApi     api.MostBotApi
// 	cookieName string
// }

// func NewAuthHandlers_old(service services.Session, auth config.AuthConfig, botApi api.MostBotApi, cookieName string) *AuthHandlers {
// 	return &AuthHandlers{
// 		service:    service,
// 		auth:       auth,
// 		botApi:     botApi,
// 		cookieName: cookieName,
// 	}
// }

// func Register(api *gin.RouterGroup, service services.Session, auth config.AuthConfig, botApi api.MostBotApi, cookieName string) {
// 	handlers := NewAuthHandlers(service, auth, botApi, cookieName)

// 	authRoute := api.Group("/auth")
// 	{
// 		authRoute.POST("/sign-in", handlers.signIn)
// 		authRoute.POST("/sign-out", handlers.signOut)
// 		authRoute.POST("/refresh", handlers.refresh)
// 	}
// }

// func (h *AuthHandlers_old) signIn(c *gin.Context) {
// 	var req models.SignIn
// 	if err := c.BindJSON(&req); err != nil {
// 		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Введены некорректные данные")
// 		return
// 	}

// 	user, token, err := h.service.SignIn(c, req)
// 	if err != nil {
// 		if errors.Is(err, models.ErrPassword) {
// 			response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Введены некорректные данные")
// 			return
// 		}
// 		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
// 		h.botApi.SendError(c, err.Error(), req)
// 		return
// 	}

// 	c.SetCookie(h.cookieName, token, int(h.auth.RefreshTokenTTL.Seconds()), "/", c.Request.Host, h.auth.Secure, true)
// 	c.JSON(http.StatusOK, response.DataResponse{Data: user})

// 	// response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
// }

// func (h *AuthHandlers_old) signOut(c *gin.Context) {
// 	tokenInHeader := c.GetHeader("Authorization")
// 	tokenInCookie, _ := c.Cookie(h.cookieName)

// 	if tokenInHeader == "" && tokenInCookie == "" {
// 		response.NewErrorResponse(c, http.StatusUnauthorized, "empty token", "сессия не найдена")
// 		return
// 	}

// 	token := tokenInCookie
// 	if tokenInHeader != "" {
// 		token = strings.Replace(tokenInHeader, "Bearer ", "", 1)
// 	}

// 	if err := h.service.SingOut(c, token); err != nil {
// 		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
// 		h.botApi.SendError(c, err.Error(), nil)
// 		return
// 	}

// 	if tokenInCookie != "" {
// 		c.SetCookie(h.cookieName, "", -1, "/", c.Request.Host, h.auth.Secure, true)
// 	}

// 	c.JSON(http.StatusNoContent, response.StatusResponse{})

// 	// response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
// }

// func (h *AuthHandlers_old) refresh(c *gin.Context) {
// 	//? у меня будет файл куки с токеном по нему я могу доставать из редиса id пользователя и проверять сессию в keycloak

// 	tokenInHeader := c.GetHeader("Authorization")
// 	tokenInCookie, _ := c.Cookie(h.cookieName)

// 	if tokenInHeader == "" && tokenInCookie == "" {
// 		response.NewErrorResponse(c, http.StatusUnauthorized, "empty token", "сессия не найдена")
// 		return
// 	}

// 	token := tokenInCookie
// 	if tokenInHeader != "" {
// 		token = strings.Replace(tokenInHeader, "Bearer ", "", 1)
// 	}

// 	user, token, err := h.service.Refresh(c, token)
// 	if err != nil {
// 		if strings.Contains(err.Error(), models.ErrSessionEmpty.Error()) {
// 			response.NewErrorResponse(c, http.StatusUnauthorized, "token is expired", "сессия не найдена")
// 			return
// 		}
// 		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
// 		h.botApi.SendError(c, err.Error(), nil)
// 		return
// 	}

// 	c.SetCookie(h.cookieName, token, int(h.auth.RefreshTokenTTL.Seconds()), "/", c.Request.Host, h.auth.Secure, true)
// 	c.JSON(http.StatusOK, response.DataResponse{Data: user})
// }
