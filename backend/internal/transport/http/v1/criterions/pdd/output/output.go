package output

import (
	"net/http"

	"github.com/Alexander272/data_center/backend/internal/models/response"
	"github.com/gin-gonic/gin"
)

type OutputHandlers struct {
	// service services.OutputService
	// TODO добавить бота для отправки ошибок
}

func NewOutputHandlers() *OutputHandlers {
	return &OutputHandlers{}
}

func Register(api *gin.RouterGroup) {
	handlers := NewOutputHandlers()

	output := api.Group("/output")
	{
		output.GET("", handlers.get)
		output.POST("", handlers.create)
		output.PUT("/:id", handlers.update)
	}
}

func (h *OutputHandlers) get(c *gin.Context) {
	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
}

func (h *OutputHandlers) create(c *gin.Context) {
	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
}

func (h *OutputHandlers) update(c *gin.Context) {
	response.NewErrorResponse(c, http.StatusInternalServerError, "not implemented", "not implemented")
}
