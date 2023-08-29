package orders_volume

import (
	"net/http"

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
		orders.GET("/:day", handlers.getByDay)
		orders.POST("/", handlers.create)
		// orders.PUT("/:id", handlers.update)
	}
}

func (h *OrdersVolumeHandlers) getByDay(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	orders, err := h.service.GetByDay(c, day)
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
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные об приходе заказов успешно добавлены"})
}
