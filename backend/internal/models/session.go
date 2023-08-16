package models

import (
	"encoding/json"
	"time"
)

type SessionData struct {
	UserId       string
	UserName     string
	Sector       string
	Role         string
	AccessToken  string
	RefreshToken string
	Exp          time.Duration
}

func (i SessionData) MarshalBinary() ([]byte, error) {
	return json.Marshal(i)
}
