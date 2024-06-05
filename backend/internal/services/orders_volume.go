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
	GetByPeriod(context.Context, *models.Period) ([]*models.OrdersVolume, error)
	Create(context.Context, *models.OrdersVolume) error
	UpdateByDay(context.Context, *models.OrdersVolume) error
	DeleteByDay(context.Context, string) error
}

func (s *OrdersVolumeService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.OrdersVolume, error) {
	if req.To == "" {
		orders, err := s.repo.GetByDay(ctx, req.From)
		if err != nil {
			return nil, fmt.Errorf(`failed to get orders volume by day. error: %w`, err)
		}
		return orders, nil
	}

	orders, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders volume by period. error: %w", err)
	}
	return orders, nil
}

func (s *OrdersVolumeService) Create(ctx context.Context, dto *models.OrdersVolume) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create orders volume. error: %w", err)
	}
	return nil
}

func (s *OrdersVolumeService) UpdateByDay(ctx context.Context, dto *models.OrdersVolume) error {
	if err := s.repo.UpdateByDay(ctx, dto); err != nil {
		return fmt.Errorf("failed to update orders volume. error: %w", err)
	}
	return nil
}

func (s *OrdersVolumeService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete orders volume by day. error: %w", err)
	}
	return nil
}
