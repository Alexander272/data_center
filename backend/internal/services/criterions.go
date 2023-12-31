package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type CriterionDeps struct {
	// shipment ShipmentPlan
	// orders   OrdersVolume
	// output   OutputVolume
	// load     ProductionLoad
}

type CriterionsService struct {
	repo repo.Criterions
	deps CriterionDeps
}

func NewCriterionsService(repo repo.Criterions, deps CriterionDeps) *CriterionsService {
	return &CriterionsService{
		repo: repo,
		deps: deps,
	}
}

type Criterions interface {
	GetAll(context.Context) ([]models.Criterions, error)
	GetByDay(context.Context, models.User, string) ([]models.CriterionsWithData, error)
}

func (s *CriterionsService) GetAll(ctx context.Context) ([]models.Criterions, error) {
	criterions, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get all criterions. error: %w", err)
	}
	return criterions, nil
}

func (s *CriterionsService) GetByDay(ctx context.Context, user models.User, day string) (criterions []models.CriterionsWithData, err error) {
	criterions, err = s.repo.GetByRole(ctx, user.Role, day)
	if err != nil {
		return nil, fmt.Errorf("failed to get criterions by role. error: %w", err)
	}

	return criterions, nil
}
