package models

type SignIn struct {
	UserName string `json:"userName" binding:"required"`
	Password string `json:"password" binding:"required"`
}
