package criterions

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/constants"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type CriterionsHandlers struct {
	service services.Criterions
}

func NewCriterionsHandlers(service services.Criterions) *CriterionsHandlers {
	return &CriterionsHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Criterions, middleware *middleware.Middleware) {
	handlers := NewCriterionsHandlers(service)

	api.GET("/all", handlers.getAll)
	api.GET("/:day", handlers.getByDay)
}

func (h *CriterionsHandlers) getAll(c *gin.Context) {
	criterions, err := h.service.GetAll(c)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: criterions})
}

func (h *CriterionsHandlers) getByDay(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	user, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "пользователь не найден")
		return
	}

	criterions, err := h.service.GetByDay(c, user.(models.User), day)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), day)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: criterions})
}
