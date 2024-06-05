package production_load

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type ProductionLoadHandlers struct {
	service services.ProductionLoad
}

func NewProductionLoadHandlers(service services.ProductionLoad) *ProductionLoadHandlers {
	return &ProductionLoadHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.ProductionLoad, middleware *middleware.Middleware) {
	handlers := NewProductionLoadHandlers(service)

	load := api.Group("/production-load")
	{
		load.GET("", handlers.get)
		load.POST("/several", handlers.create)
		load.PUT("/several", handlers.update)
		load.DELETE("/:date", handlers.delete)
	}
}

func (h *ProductionLoadHandlers) get(c *gin.Context) {
	period := c.QueryMap("period")
	if len(period) == 0 {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	req := &models.Period{
		From: period["from"],
		To:   period["to"],
	}

	load, err := h.service.GetByPeriod(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: load})
}

func (h *ProductionLoadHandlers) create(c *gin.Context) {
	dto := []*models.ProductionLoad{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о загруженности успешно добавлены"})
}

func (h *ProductionLoadHandlers) update(c *gin.Context) {
	dto := []*models.ProductionLoad{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
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
		error_bot.Send(c, err.Error(), date)
		return
	}
	c.JSON(http.StatusNoContent, response.IdResponse{})
}
