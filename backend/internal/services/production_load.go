package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ProductionLoadService struct {
	repo repo.ProductionLoad
}

func NewProductionLoadService(repo repo.ProductionLoad) *ProductionLoadService {
	return &ProductionLoadService{
		repo: repo,
	}
}

type ProductionLoad interface {
	GetByPeriod(context.Context, *models.Period) ([]*models.ProductionLoad, error)
	CreateSeveral(context.Context, []*models.ProductionLoad) error
	UpdateSeveral(context.Context, []*models.ProductionLoad) error
	DeleteByDate(context.Context, string) error
}

func (s *ProductionLoadService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.ProductionLoad, error) {
	load, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get production load by period. error: %w", err)
	}
	return load, nil
}

func (s *ProductionLoadService) CreateSeveral(ctx context.Context, dto []*models.ProductionLoad) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several production load. error: %w", err)
	}
	return nil
}

func (s *ProductionLoadService) UpdateSeveral(ctx context.Context, dto []*models.ProductionLoad) error {
	if err := s.DeleteByDate(ctx, fmt.Sprintf("%d", dto[0].Date)); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, dto); err != nil {
		return err
	}
	return nil
}

func (s *ProductionLoadService) DeleteByDate(ctx context.Context, date string) error {
	if err := s.repo.DeleteByDate(ctx, date); err != nil {
		return fmt.Errorf("failed to delete production load by date. error: %w", err)
	}
	return nil
}
