package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type OrdersVolumeService struct {
	repo repo.OrdersVolume
}

func NewOrdersVolumeService(repo repo.OrdersVolume) *OrdersVolumeService {
	return &OrdersVolumeService{
		repo: repo,
	}
}

type OrdersVolume interface {
	GetByDay(context.Context, string) ([]models.OrdersVolume, error)
	Create(context.Context, models.OrdersVolume) error
}

func (s *OrdersVolumeService) GetByDay(ctx context.Context, day string) ([]models.OrdersVolume, error) {
	orders, err := s.repo.GetByDay(ctx, day)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders volume by day. error: %w", err)
	}
	return orders, nil
}

func (s *OrdersVolumeService) Create(ctx context.Context, order models.OrdersVolume) error {
	if err := s.repo.Create(ctx, order); err != nil {
		return fmt.Errorf("failed to create orders volume. error: %w", err)
	}
	return nil
}