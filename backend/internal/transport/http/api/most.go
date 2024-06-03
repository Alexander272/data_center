package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Alexander272/data_center/backend/internal/models/bot"
	"github.com/Alexander272/data_center/backend/pkg/logger"
	"github.com/gin-gonic/gin"
)

type MostApi struct {
	URL string
}

type MostBotApi interface {
	Ping() string
	SendError(c *gin.Context, err string, request interface{})
}

func NewMostApi(url string) *MostApi {
	return &MostApi{
		URL: "http://" + url,
	}
}

func (h *MostApi) Ping() string {
	return "Pong"
}

func (h *MostApi) SendError(c *gin.Context, e string, request interface{}) {
	var data []byte
	if request != nil {
		var err error
		data, err = json.Marshal(request)
		if err != nil {
			logger.Error("body error: ", err)
		}
	}

	message := bot.Message{
		Service: bot.Service{
			Name: "Data Center",
			Id:   "dashboard",
		},
		Data: bot.MessageData{
			Date:    time.Now().Format("02/01/2006 - 15:04:05"),
			IP:      c.ClientIP(),
			URL:     fmt.Sprintf("%s %s", c.Request.Method, c.Request.URL.String()),
			Error:   e,
			Request: string(data),
		},
	}

	var buf bytes.Buffer
	err := json.NewEncoder(&buf).Encode(message)
	if err != nil {
		logger.Errorf("failed to read struct. error: %s", err.Error())
	}

	_, err = http.Post(fmt.Sprintf("%s/api/v1/mattermost/send", h.URL), "application/json", &buf)
	if err != nil {
		logger.Errorf("failed to send error to bot. error: %s", err.Error())
	}
}
