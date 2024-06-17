package complete

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

type CriterionsHandlers struct {
	service services.CompleteCriterion
}

func NewCriterionsHandlers(service services.CompleteCriterion) *CriterionsHandlers {
	return &CriterionsHandlers{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.CompleteCriterion, middleware *middleware.Middleware) {
	handlers := NewCriterionsHandlers(service)

	complete := api.Group("/complete")
	{
		complete.GET("/:date", middleware.CheckPermissions(constants.Criterion, constants.Write), handlers.getByDate)
		complete.POST("", middleware.CheckPermissions(constants.Criterion, constants.Write), handlers.create)
		// complete.POST("/:id", handlers.complete)
	}
}

func (h *CriterionsHandlers) getByDate(c *gin.Context) {
	date := c.Param("date")
	if date == "" {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "день не задан")
		return
	}

	user, exists := c.Get(constants.CtxUser)
	if !exists {
		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "пользователь не найден")
		return
	}

	req := &models.GetCompeteDTO{
		Date: date,
		Role: user.(models.User).Role,
	}

	complete, err := h.service.GetByDate(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), req)
		return
	}

	c.JSON(http.StatusOK, response.DataResponse{Data: complete})
}

func (h *CriterionsHandlers) create(c *gin.Context) {
	dto := &models.CompleteCriterionDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
		return
	}

	if err := h.service.Create(c, dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
		error_bot.Send(c, err.Error(), dto)
		return
	}
	c.JSON(http.StatusCreated, response.IdResponse{Message: "Критерий заполнен"})
}

// func (h *CriterionsHandlers) complete(c *gin.Context) {
// 	id := c.Param("id")
// 	if id == "" {
// 		response.NewErrorResponse(c, http.StatusBadRequest, "empty param", "id критерия не задан")
// 		return
// 	}

// 	dto := &models.CompleteCriterionDTO{}
// 	if err := c.BindJSON(dto); err != nil {
// 		response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Отправлены некорректные данные")
// 		return
// 	}

// 	user, exists := c.Get(constants.CtxUser)
// 	if !exists {
// 		response.NewErrorResponse(c, http.StatusUnauthorized, "empty user", "пользователь не найден")
// 		return
// 	}
// 	dto.CriterionId = id
// 	dto.Role = user.(models.User).Role

// 	if err := h.service.Create(c, dto); err != nil {
// 		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка: "+err.Error())
// 		error_bot.Send(c, err.Error(), dto)
// 		return
// 	}
// 	c.JSON(http.StatusCreated, response.IdResponse{Message: "Критерий заполнен"})
// }
