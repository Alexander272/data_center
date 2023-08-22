package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type MenuService struct {
	repo repo.Menu
}

func NewMenuService(repo repo.Menu) *MenuService {
	return &MenuService{
		repo: repo,
	}
}

type Menu interface {
	GetByRole(context.Context, string) ([]models.Menu, error)
}

func (s *MenuService) GetByRole(ctx context.Context, role string) ([]models.Menu, error) {
	menus, err := s.repo.GetByRole(ctx, role)
	if err != nil {
		return nil, fmt.Errorf("failed to get menus by role. error: %w", err)
	}
	return menus, nil
}
