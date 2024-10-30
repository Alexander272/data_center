package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type QualityService struct {
	repo repo.Quality
}

func NewQualityService(repo repo.Quality) *QualityService {
	return &QualityService{
		repo: repo,
	}
}

type Quality interface {
	GetByPeriod(ctx context.Context, req *models.GetQualityDTO) ([]*models.Quality, error)
	Create(ctx context.Context, dto *models.Quality) error
	CreateSeveral(ctx context.Context, dto []*models.Quality) error
	Update(ctx context.Context, dto *models.Quality) error
	UpdateSeveral(ctx context.Context, dto []*models.Quality) error
	Delete(ctx context.Context, id string) error
}

func (s *QualityService) GetByPeriod(ctx context.Context, req *models.GetQualityDTO) ([]*models.Quality, error) {
	data, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get quality by period. error: %w", err)
	}
	return data, nil
}

func (s *QualityService) Create(ctx context.Context, dto *models.Quality) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create quality. error: %w", err)
	}
	return nil
}

func (s *QualityService) CreateSeveral(ctx context.Context, dto []*models.Quality) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several quality. error: %w", err)
	}
	return nil
}

func (s *QualityService) Update(ctx context.Context, dto *models.Quality) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update quality. error: %w", err)
	}
	return nil
}

func (s *QualityService) UpdateSeveral(ctx context.Context, dto []*models.Quality) error {
	if err := s.repo.UpdateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to update several quality. error: %w", err)
	}
	return nil
}

func (s *QualityService) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete quality. error: %w", err)
	}
	return nil
}
