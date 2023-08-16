package services

import "github.com/Alexander272/data_center/backend/internal/repo"

type MenuService struct {
	repo repo.Menu
}

func NewMenuService(repo repo.Menu) *MenuService {
	return &MenuService{
		repo: repo,
	}
}
