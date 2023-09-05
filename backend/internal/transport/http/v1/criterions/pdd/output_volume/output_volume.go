package output_volume

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type OutputVolumeHandlers struct {
	service services.OutputVolume
	// TODO добавить бота для отправки ошибок
}

func NewOutputVolumeHandlers(service services.OutputVolume) *OutputVolumeHandlers {
	return &OutputVolumeHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.OutputVolume) {
	handlers := NewOutputVolumeHandlers(service)

	output := api.Group("/output")
	{
		output.GET("/:period", handlers.get)
		output.POST("/several", handlers.create)
		output.PUT("/several", handlers.update)
		output.DELETE("/:day", handlers.delete)
	}
}

func (h *OutputVolumeHandlers) get(c *gin.Context) {
	period := c.Param("period")
	if period == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "период не задан")
		return
	}

	day := period
	// if strings.Contains(period, "-") {
	// TODO если это период, то его нужно разбивать на составные части и делать запрос на получение данных за период
	// }

	output, err := h.service.GetByDay(c, day)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
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
		return
	}
	c.JSON(http.StatusOK, response.IdResponse{})
}
