package production_plan

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ProductionPlanHandlers struct {
	service services.ProductionPlan
	// TODO добавить бота для отправки ошибок
}

func NewProductionPlanHandlers(service services.ProductionPlan) *ProductionPlanHandlers {
	return &ProductionPlanHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ProductionPlan) {
	handlers := NewProductionPlanHandlers(service)

	plan := api.Group("/production-plan")
	{
		plan.GET("/:period", handlers.get)
		plan.POST("/several", handlers.create)
		plan.PUT("/several", handlers.update)
		plan.DELETE("/:date", handlers.delete)
	}
}

func (h *ProductionPlanHandlers) get(c *gin.Context) {
	p := c.Param("period")
	if p == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "период не задан")
		return
	}

	typePlan := c.Query("type")
	if typePlan == "" {
		typePlan = "shipment"
	}

	period := models.Period{From: p}
	if strings.Contains(p, "-") {
		parts := strings.Split(p, "-")
		period.From = parts[0]
		period.To = parts[1]
	}

	load, err := h.service.GetByPeriod(c, period, typePlan)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: load})
}

func (h *ProductionPlanHandlers) create(c *gin.Context) {
	var dto []models.ProductionPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о плане успешно добавлены"})
}

func (h *ProductionPlanHandlers) update(c *gin.Context) {
	var dto []models.ProductionPlan
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о плане успешно обновлены"})
}

func (h *ProductionPlanHandlers) delete(c *gin.Context) {
	date := c.Param("date")
	if date == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	typePlan := c.Query("type")
	if typePlan == "" {
		typePlan = "shipment"
	}

	if err := h.service.DeleteByDate(c, date, typePlan); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{})
}
