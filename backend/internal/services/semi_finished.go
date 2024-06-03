package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type SemiFinishedService struct {
	repo repo.SemiFinished
}

func NewSemiFinishedService(repo repo.SemiFinished) *SemiFinishedService {
	return &SemiFinishedService{
		repo: repo,
	}
}

type SemiFinished interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.SemiFinished, error)
	Create(context.Context, *models.SemiFinished) error
	CreateSeveral(context.Context, []*models.SemiFinished) error
	UpdateSeveral(context.Context, []*models.SemiFinished) error
	DeleteByDay(context.Context, string) error
}

func (s *SemiFinishedService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.SemiFinished, error) {
	data, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get semi-finished by period. error: %w", err)
	}
	return data, nil
}

func (s *SemiFinishedService) Create(ctx context.Context, dto *models.SemiFinished) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create semi-finished. error: %w", err)
	}
	return nil
}

func (s *SemiFinishedService) CreateSeveral(ctx context.Context, dto []*models.SemiFinished) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several semi-finished. error: %w", err)
	}
	return nil
}

func (s *SemiFinishedService) UpdateSeveral(ctx context.Context, dto []*models.SemiFinished) error {
	if err := s.repo.UpdateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to update several semi-finished. error: %w", err)
	}
	return nil
}

func (s *SemiFinishedService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete semi-finished by day. error: %w", err)
	}
	return nil
}
