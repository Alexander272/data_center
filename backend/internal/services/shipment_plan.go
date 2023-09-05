package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ShipmentPlanService struct {
	repo repo.ShipmentPlan
}

func NewShipmentPlanService(repo repo.ShipmentPlan) *ShipmentPlanService {
	return &ShipmentPlanService{
		repo: repo,
	}
}

type ShipmentPlan interface {
	GetByDay(context.Context, string) ([]models.ShipmentPlan, error)
	Create(context.Context, models.ShipmentPlan) error
	CreateSeveral(context.Context, []models.ShipmentPlan) error
	UpdateSeveral(context.Context, []models.ShipmentPlan) error
	DeleteByDay(context.Context, string) error
}

func (s *ShipmentPlanService) GetByDay(ctx context.Context, day string) ([]models.ShipmentPlan, error) {
	//? надо ли как-то преобразовывать день?
	plan, err := s.repo.GetByDay(ctx, day)
	if err != nil {
		return nil, fmt.Errorf(`failed to get shipment plan by day. error: %w`, err)
	}
	return plan, nil
}

func (s *ShipmentPlanService) Create(ctx context.Context, plan models.ShipmentPlan) error {
	if err := s.repo.Create(ctx, plan); err != nil {
		return fmt.Errorf("failed to create shipment plan. error: %w", err)
	}
	return nil
}

func (s *ShipmentPlanService) CreateSeveral(ctx context.Context, plan []models.ShipmentPlan) error {
	if err := s.repo.CreateSeveral(ctx, plan); err != nil {
		return fmt.Errorf("failed to create several shipment plan. error: %w", err)
	}
	return nil
}

func (s *ShipmentPlanService) UpdateSeveral(ctx context.Context, plan []models.ShipmentPlan) error {
	if err := s.DeleteByDay(ctx, plan[0].Day); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, plan); err != nil {
		return err
	}
	return nil
}

func (s *ShipmentPlanService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete shipment plan by day. error: %w", err)
	}
	return nil
}
