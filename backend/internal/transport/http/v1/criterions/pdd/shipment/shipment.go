package shipment

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/api"
	"github.com/gin-gonic/gin"
)

type ShipmentHandlers struct {
	service services.Shipment
	botApi  api.MostBotApi
}

func NewShipmentHandlers(service services.Shipment, botApi api.MostBotApi) *ShipmentHandlers {
	return &ShipmentHandlers{
		service: service,
		botApi:  botApi,
	}
}

func Register(api *gin.RouterGroup, service services.Shipment, botApi api.MostBotApi) {
	handlers := NewShipmentHandlers(service, botApi)

	shipment := api.Group("/shipment")
	{
		shipment.GET("/:period", handlers.getByDay)
		shipment.POST("/", handlers.create)
		shipment.POST("/several", handlers.createSeveral)
		shipment.PUT("/several", handlers.update)
		shipment.DELETE("/:day", handlers.delete)
	}
}

func (h *ShipmentHandlers) getByDay(c *gin.Context) {
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

	shipment, err := h.service.GetByPeriod(c, period)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: shipment})
}

func (h *ShipmentHandlers) create(c *gin.Context) {
	var dto models.Shipment
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные об отгрузке успешно добавлены"})
}

func (h *ShipmentHandlers) createSeveral(c *gin.Context) {
	var dto []models.Shipment
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные об отгрузке успешно добавлены"})
}

func (h *ShipmentHandlers) update(c *gin.Context) {
	var dto []models.Shipment
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные об отгрузке успешно обновлены"})
}

func (h *ShipmentHandlers) delete(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	if err := h.service.DeleteByDay(c, day); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), day)
		return
	}
	c.JSON(http.StatusNoContent, response.IdResponse{})
}
