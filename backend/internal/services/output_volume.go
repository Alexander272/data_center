package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type OutputVolumeService struct {
	repo repo.OutputVolume
}

func NewOutputVolumeService(repo repo.OutputVolume) *OutputVolumeService {
	return &OutputVolumeService{
		repo: repo,
	}
}

type OutputVolume interface {
	// GetByDay(context.Context, string) ([]models.OutputVolume, error)
	GetByPeriod(context.Context, models.Period) ([]models.OutputVolume, error)
	CreateSeveral(context.Context, []models.OutputVolume) error
	UpdateSeveral(context.Context, []models.OutputVolume) error
	DeleteByDay(context.Context, string) error
}

func (s *OutputVolumeService) GetByPeriod(ctx context.Context, period models.Period) (output []models.OutputVolume, err error) {
	if period.To == "" {
		output, err = s.repo.GetByDay(ctx, period.From)
		if err != nil {
			return nil, fmt.Errorf(`failed to get output volume by day. error: %w`, err)
		}
	} else {
		output, err = s.repo.GetByPeriod(ctx, period)
		if err != nil {
			return nil, fmt.Errorf("failed to get output volume by period. error: %w", err)
		}
	}

	return output, nil
}

func (s *OutputVolumeService) CreateSeveral(ctx context.Context, output []models.OutputVolume) error {
	if err := s.repo.CreateSeveral(ctx, output); err != nil {
		return fmt.Errorf("failed to create several output volume. error: %w", err)
	}
	return nil
}

func (s *OutputVolumeService) UpdateSeveral(ctx context.Context, output []models.OutputVolume) error {
	if err := s.DeleteByDay(ctx, output[0].Day); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, output); err != nil {
		return err
	}
	return nil
}

func (s *OutputVolumeService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete output volume. error: %w", err)
	}
	return nil
}
