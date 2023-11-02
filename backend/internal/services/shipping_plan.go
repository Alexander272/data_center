package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ShippingPlanService struct {
	repo repo.ShippingPlan
}

func NewShippingService(repo repo.ShippingPlan) *ShippingPlanService {
	return &ShippingPlanService{
		repo: repo,
	}
}

type ShippingPlan interface {
	GetByPeriod(context.Context, models.Period) ([]models.ShippingPlan, error)
	Create(context.Context, models.ShippingPlan) error
	UpdateByDay(context.Context, models.ShippingPlan) error
	DeleteByDay(context.Context, string) error
}

func (s *ShippingPlanService) GetByPeriod(ctx context.Context, period models.Period) ([]models.ShippingPlan, error) {
	plan, err := s.repo.GetByPeriod(ctx, period)
	if err != nil {
		return nil, fmt.Errorf("failed to get shipping plan by period. error: %w", err)
	}
	return plan, nil
}

func (s *ShippingPlanService) Create(ctx context.Context, plan models.ShippingPlan) error {
	if err := s.repo.Create(ctx, plan); err != nil {
		return fmt.Errorf("failed to create shipping plan. error: %w", err)
	}
	return nil
}

func (s *ShippingPlanService) UpdateByDay(ctx context.Context, plan models.ShippingPlan) error {
	if err := s.repo.UpdateByDay(ctx, plan); err != nil {
		return fmt.Errorf("failed to update shipping plan. error: %w", err)
	}
	return nil
}

func (s *ShippingPlanService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete shipping plan. error: %w", err)
	}
	return nil
}
