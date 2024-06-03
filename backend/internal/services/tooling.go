package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ToolingService struct {
	repo repo.Tooling
}

func NewToolingService(repo repo.Tooling) *ToolingService {
	return &ToolingService{
		repo: repo,
	}
}

type Tooling interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.Tooling, error)
	Create(context.Context, *models.Tooling) error
	Update(context.Context, *models.Tooling) error
	UpdateByDay(context.Context, *models.Tooling) error
	DeleteByDay(context.Context, string) error
}

func (s *ToolingService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Tooling, error) {
	data, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get tooling by period. error: %w", err)
	}
	return data, nil
}

func (s *ToolingService) Create(ctx context.Context, dto *models.Tooling) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create tooling. error: %w", err)
	}
	return nil
}

func (s *ToolingService) Update(ctx context.Context, dto *models.Tooling) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update tooling. error: %w", err)
	}
	return nil
}
func (s *ToolingService) UpdateByDay(ctx context.Context, dto *models.Tooling) error {
	if err := s.repo.UpdateByDay(ctx, dto); err != nil {
		return fmt.Errorf("failed to update tooling by day. error: %w", err)
	}
	return nil
}

func (s *ToolingService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete tooling by day. error: %w", err)
	}
	return nil
}
