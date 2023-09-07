package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ProductionPlanService struct {
	repo repo.ProductionPlan
}

func NewProductionPlanService(repo repo.ProductionPlan) *ProductionPlanService {
	return &ProductionPlanService{
		repo: repo,
	}
}

type ProductionPlan interface {
	GetByPeriod(context.Context, models.Period) ([]models.ProductionPlan, error)
	CreateSeveral(context.Context, []models.ProductionPlan) error
	UpdateSeveral(context.Context, []models.ProductionPlan) error
	DeleteByDate(context.Context, string) error
}

func (s *ProductionPlanService) GetByPeriod(ctx context.Context, period models.Period) ([]models.ProductionPlan, error) {
	plan, err := s.repo.GetByPeriod(ctx, period)
	if err != nil {
		return nil, fmt.Errorf("failed to get production plan by period. error: %w", err)
	}
	return plan, nil
}

func (s *ProductionPlanService) CreateSeveral(ctx context.Context, plan []models.ProductionPlan) error {
	if err := s.repo.CreateSeveral(ctx, plan); err != nil {
		return fmt.Errorf("failed to create several production plan. error: %w", err)
	}
	return nil
}

func (s *ProductionPlanService) UpdateSeveral(ctx context.Context, plan []models.ProductionPlan) error {
	if err := s.DeleteByDate(ctx, plan[0].Date); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, plan); err != nil {
		return err
	}
	return nil
}

func (s *ProductionPlanService) DeleteByDate(ctx context.Context, date string) error {
	if err := s.repo.DeleteByDate(ctx, date); err != nil {
		return fmt.Errorf("failed to delete production plan by date. error: %w", err)
	}
	return nil
}
