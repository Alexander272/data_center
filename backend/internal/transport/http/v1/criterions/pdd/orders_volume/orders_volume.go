package orders_volume

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type OrdersVolumeHandlers struct {
	service services.OrdersVolume
	// TODO добавить бота для отправки ошибок
}

func NewOrdersVolumeHandlers(service services.OrdersVolume) *OrdersVolumeHandlers {
	return &OrdersVolumeHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.OrdersVolume) {
	handlers := NewOrdersVolumeHandlers(service)

	orders := api.Group("/orders-volume")
	{
		orders.GET("/:period", handlers.getByPeriod)
		orders.POST("/", handlers.create)
		orders.PUT("/:day", handlers.update)
		orders.DELETE("/:day", handlers.delete)
	}
}

func (h *OrdersVolumeHandlers) getByPeriod(c *gin.Context) {
	p := c.Param("period")
	if p == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "период не задан")
		return
	}

	period := models.Period{From: p}
	if strings.Contains(p, "-") {
		parts := strings.Split(p, "-")
		period.From = parts[0]
		period.To = parts[1]
	}

	orders, err := h.service.GetByPeriod(c, period)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: orders})
}

func (h *OrdersVolumeHandlers) create(c *gin.Context) {
	var dto models.OrdersVolume
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о приходе заказов успешно добавлены"})
}

func (h *OrdersVolumeHandlers) update(c *gin.Context) {
	var dto models.OrdersVolume
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateByDay(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о прихоже заказов успешно обновлены"})
}

func (h *OrdersVolumeHandlers) delete(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	if err := h.service.DeleteByDay(c, day); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{})
}
