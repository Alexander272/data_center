package shipment_plan

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ShipmentPlanHandlers struct {
	service services.ShipmentPlan
	// TODO добавить бота для отправки ошибок
}

func NewShipmentPlanHandlers(service services.ShipmentPlan) *ShipmentPlanHandlers {
	return &ShipmentPlanHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ShipmentPlan) {
	handlers := NewShipmentPlanHandlers(service)

	shipment := api.Group("/shipment-plan")
	{
		shipment.GET("/:day", handlers.getByDay)
		shipment.POST("/", handlers.create)
		shipment.POST("/several", handlers.createSeveral)
		shipment.PUT("/several", handlers.update)
		shipment.DELETE("/:day", handlers.delete)
	}
}

func (h *ShipmentPlanHandlers) getByDay(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	plan, err := h.service.GetByDay(c, day)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: plan})
}

func (h *ShipmentPlanHandlers) create(c *gin.Context) {
	var dto models.ShipmentPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные об отгрузке успешно добавлены"})
}

func (h *ShipmentPlanHandlers) createSeveral(c *gin.Context) {
	var dto []models.ShipmentPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные об отгрузке успешно добавлены"})
}

func (h *ShipmentPlanHandlers) update(c *gin.Context) {
	var dto []models.ShipmentPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные об отгрузке успешно обновлены"})
}

func (h *ShipmentPlanHandlers) delete(c *gin.Context) {
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
