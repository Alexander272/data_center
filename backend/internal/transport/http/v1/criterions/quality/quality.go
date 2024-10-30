package quality

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

type Handlers struct {
	service services.Quality
}

func NewHandlers(service services.Quality) *Handlers {
	return &Handlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Quality, middleware *middleware.Middleware) {
	handlers := NewHandlers(service)

	quality := api.Group("/quality")
	{
		quality.GET("", middleware.CheckPermissions(constants.Quality, constants.Read), handlers.getByPeriod)
		quality.POST("", middleware.CheckPermissions(constants.Quality, constants.Write), handlers.create)
		quality.POST("/several", middleware.CheckPermissions(constants.Quality, constants.Write), handlers.createSeveral)
		quality.PUT("/:id", middleware.CheckPermissions(constants.Quality, constants.Write), handlers.update)
		quality.PUT("/several", middleware.CheckPermissions(constants.Quality, constants.Write), handlers.updateSeveral)
	}
}

func (h *Handlers) getByPeriod(c *gin.Context) {
	product := c.Query("product")
	if product == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Продукт не задан")
		return
	}

	period := c.QueryMap("period")
	if len(period) == 0 {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "Период не задан")
		return
	}

	per := &models.Period{
		From: period["from"],
		To:   period["to"],
	}
	req := &models.GetQualityDTO{
		Product: product,
		Period:  per,
	}

	data, err := h.service.GetByPeriod(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handlers) create(c *gin.Context) {
	dto := &models.Quality{}
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

func (h *Handlers) createSeveral(c *gin.Context) {
	dto := []*models.Quality{}
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

func (h *Handlers) update(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "id не задан")
		return
	}

	dto := &models.Quality{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}
	dto.Id = id

	if err := h.service.Update(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные успешно обновлены"})
}

func (h *Handlers) updateSeveral(c *gin.Context) {
	dto := []*models.Quality{}
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные успешно обновлены"})
}
