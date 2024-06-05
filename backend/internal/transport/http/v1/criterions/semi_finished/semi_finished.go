package semi_finished

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/middleware"
	"github.com/Alexander272/data_center/backend/pkg/error_bot"
	"github.com/gin-gonic/gin"
)

type SemiFinishedHandlers struct {
	service services.SemiFinished
}

func NewSemiFinishedHandlers(service services.SemiFinished) *SemiFinishedHandlers {
	return &SemiFinishedHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.SemiFinished, middleware *middleware.Middleware) {
	handlers := NewSemiFinishedHandlers(service)

	semiFinished := api.Group("semi-finished")
	{
		semiFinished.GET("", handlers.getByPeriod)
		semiFinished.POST("", handlers.create)
		semiFinished.POST("/several", handlers.createSeveral)
		semiFinished.PUT("/several", handlers.updateSeveral)
		semiFinished.DELETE("/:day", handlers.delete)
	}
}

func (h *SemiFinishedHandlers) getByPeriod(c *gin.Context) {
	//? если мне нужно будет получать данные за период ограниченный с одной стороны, я могу ввести period[day] для получения данных в текущем варианте (за день)
	period := c.QueryMap("period")
	if len(period) == 0 {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	req := &models.Period{
		From: period["from"],
		To:   period["to"],
	}

	data, err := h.service.GetByPeriod(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *SemiFinishedHandlers) create(c *gin.Context) {
	dto := &models.SemiFinished{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные успешно добавлены"})
}

func (h *SemiFinishedHandlers) createSeveral(c *gin.Context) {
	dto := []*models.SemiFinished{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные успешно добавлены"})
}

func (h *SemiFinishedHandlers) updateSeveral(c *gin.Context) {
	dto := []*models.SemiFinished{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные успешно обновлены"})
}

func (h *SemiFinishedHandlers) delete(c *gin.Context) {
	day := c.Param("day")
	if day == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	if err := h.service.DeleteByDay(c, day); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), day)
		return
	}
	c.JSON(http.StatusNoContent, response.IdResponse{})
}
