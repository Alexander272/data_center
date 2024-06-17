package production_plan

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

type ProductionPlanHandlers struct {
	service services.ProductionPlan
}

func NewProductionPlanHandlers(service services.ProductionPlan) *ProductionPlanHandlers {
	return &ProductionPlanHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ProductionPlan, middleware *middleware.Middleware) {
	handlers := NewProductionPlanHandlers(service)

	plan := api.Group("/production-plan")
	{
		plan.GET("", middleware.CheckPermissions(constants.ProductionPlan, constants.Read), handlers.get)
		plan.POST("/several", middleware.CheckPermissions(constants.ProductionPlan, constants.Write), handlers.create)
		plan.PUT("/several", middleware.CheckPermissions(constants.ProductionPlan, constants.Write), handlers.update)
		plan.DELETE("/:date", middleware.CheckPermissions(constants.ProductionPlan, constants.Write), handlers.delete)
	}
}

func (h *ProductionPlanHandlers) get(c *gin.Context) {
	typePlan := c.Query("type")
	if typePlan == "" {
		typePlan = "shipment"
	}

	period := c.QueryMap("period")
	if len(period) == 0 {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	req := &models.Period{
		From: period["from"],
		To:   period["to"],
	}

	load, err := h.service.GetByPeriod(c, req, typePlan)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: load})
}

func (h *ProductionPlanHandlers) create(c *gin.Context) {
	dto := []*models.ProductionPlan{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о плане успешно добавлены"})
}

func (h *ProductionPlanHandlers) update(c *gin.Context) {
	dto := []*models.ProductionPlan{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
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
		error_bot.Send(c, err.Error(), date)
		return
	}
	c.JSON(http.StatusNoContent, response.IdResponse{})
}
