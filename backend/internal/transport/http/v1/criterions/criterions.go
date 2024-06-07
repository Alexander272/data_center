package criterions

import (
	"net/http"
	"strconv"

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

	api.GET("/:date", handlers.getByDate)
	api.GET("/all", handlers.getAll)
}

func (h *CriterionsHandlers) getAll(c *gin.Context) {
	criterions, err := h.service.GetAll(c, &models.CriterionParams{})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), nil)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: criterions})
}

func (h *CriterionsHandlers) getByDate(c *gin.Context) {
	date := c.Param("date")
	if date == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	d, err := strconv.Atoi(date)
	if err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	criterions, err := h.service.GetByDate(c, &models.GetCriterionDTO{Date: int64(d)})
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), date)
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

	// TODO критерии можно поделить на daily (ежедневно), in_weekdays (в рабочие дни), monthly (ежемесячно)
	// можно передавать массив с нужными категориями. массив формировать в зависимости от передаваемого дня
	// либо группировать daily и in_weekdays, а monthly получать всегда, просто разделять это все на группы

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
