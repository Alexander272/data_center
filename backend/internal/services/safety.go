package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type SafetyService struct {
	repo repo.Safety
}

func NewSafetyService(repo repo.Safety) *SafetyService {
	return &SafetyService{
		repo: repo,
	}
}

type Safety interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.Safety, error)
	Create(context.Context, *models.Safety) error
	Update(context.Context, *models.Safety) error
	UpdateByDate(context.Context, *models.Safety) error
	DeleteByDate(context.Context, string) error
}

func (s *SafetyService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Safety, error) {
	safety, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get safety by period. error: %w", err)
	}
	return safety, nil
}

func (s *SafetyService) Create(ctx context.Context, dto *models.Safety) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create safety. error: %w", err)
	}
	return nil
}

func (s *SafetyService) Update(ctx context.Context, dto *models.Safety) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update safety. error: %w", err)
	}
	return nil
}

func (s *SafetyService) UpdateByDate(ctx context.Context, dto *models.Safety) error {
	if err := s.repo.UpdateByDate(ctx, dto); err != nil {
		return fmt.Errorf("failed to update safety by date. error: %w", err)
	}
	return nil
}

func (s *SafetyService) DeleteByDate(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDate(ctx, day); err != nil {
		return fmt.Errorf("failed to delete safety by date. error: %w", err)
	}
	return nil
}
