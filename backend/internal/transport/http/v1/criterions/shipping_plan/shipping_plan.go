package shipping_plan

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type ShippingPlanHandlers struct {
	service services.ShippingPlan
}

func NewShippingPlanHandlers(service services.ShippingPlan) *ShippingPlanHandlers {
	return &ShippingPlanHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ShippingPlan, middleware *middleware.Middleware) {
	handlers := NewShippingPlanHandlers(service)

	shipping := api.Group("shipping-plan")
	{
		shipping.GET("", handlers.getByPeriod)
		shipping.POST("", handlers.create)
		shipping.PUT("/:day", handlers.updateByDay)
		shipping.DELETE("/:day", handlers.deleteByDay)
	}
}

func (h *ShippingPlanHandlers) getByPeriod(c *gin.Context) {
	period := c.QueryMap("period")
	if len(period) == 0 {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	req := &models.Period{
		From: period["from"],
		To:   period["to"],
	}

	shipping, err := h.service.GetByPeriod(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: shipping})
}

func (h *ShippingPlanHandlers) create(c *gin.Context) {
	dto := &models.ShippingPlan{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}

	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о плане отгрузки успешно добавлены"})
}

func (h *ShippingPlanHandlers) updateByDay(c *gin.Context) {
	dto := &models.ShippingPlan{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateByDay(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
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
		error_bot.Send(c, err.Error(), day)
		return
	}

	c.JSON(http.StatusNoContent, response.IdResponse{})
}
