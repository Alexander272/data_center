package shipping_plan

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/api"
	"github.com/gin-gonic/gin"
)

type ShippingPlanHandlers struct {
	service services.ShippingPlan
	botApi  api.MostBotApi
}

func NewShippingPlanHandlers(service services.ShippingPlan, botApi api.MostBotApi) *ShippingPlanHandlers {
	return &ShippingPlanHandlers{
		service: service,
		botApi:  botApi,
	}
}

func Register(api *gin.RouterGroup, service services.ShippingPlan, botApi api.MostBotApi) {
	handlers := NewShippingPlanHandlers(service, botApi)

	shipping := api.Group("shipping-plan")
	{
		shipping.GET("/:period", handlers.getByPeriod)
		shipping.POST("", handlers.create)
		shipping.PUT("/:day", handlers.updateByDay)
		shipping.DELETE("/:day", handlers.deleteByDay)
	}
}

func (h *ShippingPlanHandlers) getByPeriod(c *gin.Context) {
	p := c.Param("period")
	if p == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	period := models.Period{From: p}
	if strings.Contains(p, "-") {
		parts := strings.Split(p, "-")
		period.From = parts[0]
		period.To = parts[1]
	}

	shipping, err := h.service.GetByPeriod(c, period)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: shipping})
}

func (h *ShippingPlanHandlers) create(c *gin.Context) {
	var dto models.ShippingPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}

	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о плане отгрузки успешно добавлены"})
}

func (h *ShippingPlanHandlers) updateByDay(c *gin.Context) {
	var dto models.ShippingPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateByDay(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}

	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о плане отгрузки успешно обновлены"})
}

func (h *ShippingPlanHandlers) deleteByDay(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "День не задан")
		return
	}

	if err := h.service.DeleteByDay(c, day); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), day)
		return
	}

	c.JSON(http.StatusNoContent, response.IdResponse{})
}
