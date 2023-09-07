package production_load

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ProductionLoadHandlers struct {
	service services.ProductionLoad
	// TODO добавить бота для отправки ошибок
}

func NewProductionLoadHandlers(service services.ProductionLoad) *ProductionLoadHandlers {
	return &ProductionLoadHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ProductionLoad) {
	handlers := NewProductionLoadHandlers(service)

	load := api.Group("/production-load")
	{
		load.GET("/:period", handlers.get)
		load.POST("/several", handlers.create)
		load.PUT("/several", handlers.update)
		load.DELETE("/:date", handlers.delete)
	}
}

func (h *ProductionLoadHandlers) get(c *gin.Context) {
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

	load, err := h.service.GetByPeriod(c, period)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: load})
}

func (h *ProductionLoadHandlers) create(c *gin.Context) {
	var dto []models.ProductionLoad
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о загруженности успешно добавлены"})
}

func (h *ProductionLoadHandlers) update(c *gin.Context) {
	var dto []models.ProductionLoad
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о загруженности успешно обновлены"})
}

func (h *ProductionLoadHandlers) delete(c *gin.Context) {
	date := c.Param("date")
	if date == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	if err := h.service.DeleteByDate(c, date); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{})
}
