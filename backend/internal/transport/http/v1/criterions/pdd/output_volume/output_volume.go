package output_volume

import (
	"net/http"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/Alexander272/data_center/backend/internal/transport/http/api"
	"github.com/gin-gonic/gin"
)

type OutputVolumeHandlers struct {
	service services.OutputVolume
	botApi  api.MostBotApi
}

func NewOutputVolumeHandlers(service services.OutputVolume, botApi api.MostBotApi) *OutputVolumeHandlers {
	return &OutputVolumeHandlers{
		service: service,
		botApi:  botApi,
	}
}

func Register(api *gin.RouterGroup, service services.OutputVolume, botApi api.MostBotApi) {
	handlers := NewOutputVolumeHandlers(service, botApi)

	output := api.Group("/output-volume")
	{
		output.GET("/:period", handlers.get)
		output.POST("/several", handlers.create)
		output.PUT("/several", handlers.update)
		output.DELETE("/:day", handlers.delete)
	}
}

func (h *OutputVolumeHandlers) get(c *gin.Context) {
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

	output, err := h.service.GetByPeriod(c, period)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), period)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: output})
}

func (h *OutputVolumeHandlers) create(c *gin.Context) {
	var dto []models.OutputVolume
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.CreateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Данные о выпуске успешно добавлены"})
}

func (h *OutputVolumeHandlers) update(c *gin.Context) {
	var dto []models.OutputVolume
	if err := c.BindJSON(&dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.UpdateSeveral(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		h.botApi.SendError(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{Message: "Данные о выпуске успешно обновлены"})
}

func (h *OutputVolumeHandlers) delete(c *gin.Context) {
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
