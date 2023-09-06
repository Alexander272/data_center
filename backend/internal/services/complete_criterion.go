package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type CompleteCriterionService struct {
	repo repo.CompleteCriterion
}

func NewCompleteCriterionService(repo repo.CompleteCriterion) *CompleteCriterionService {
	return &CompleteCriterionService{
		repo: repo,
	}
}

type CompleteCriterion interface {
	Get(context.Context, models.ReportFilter) ([]models.ReportComplete, error)
	Create(context.Context, models.CompleteCriterion) error
}

func (s *CompleteCriterionService) Get(ctx context.Context, filter models.ReportFilter) ([]models.ReportComplete, error) {
	complete, err := s.repo.Get(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get complete report. error: %w", err)
	}

	if err = s.repo.DeleteOld(ctx, filter.LastDate); err != nil {
		return nil, fmt.Errorf("failed to delete old complete. error: %w", err)
	}

	return complete, nil
}

func (s *CompleteCriterionService) Create(ctx context.Context, criterion models.CompleteCriterion) error {
	if err := s.repo.Create(ctx, criterion); err != nil {
		return fmt.Errorf("failed to create complete criterion. error: %w", err)
	}
	return nil
}
