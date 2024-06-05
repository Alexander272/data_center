package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type ShipmentService struct {
	repo repo.Shipment
}

func NewShipmentService(repo repo.Shipment) *ShipmentService {
	return &ShipmentService{
		repo: repo,
	}
}

type Shipment interface {
	// GetByDay(context.Context, string) ([]models.Shipment, error)
	GetByPeriod(context.Context, *models.Period) ([]*models.Shipment, error)
	Create(context.Context, *models.Shipment) error
	CreateSeveral(context.Context, []*models.Shipment) error
	UpdateSeveral(context.Context, []*models.Shipment) error
	DeleteByDay(context.Context, string) error
}

func (s *ShipmentService) GetByPeriod(ctx context.Context, req *models.Period) ([]*models.Shipment, error) {
	if req.To == "" {
		shipment, err := s.repo.GetByDay(ctx, req.From)
		if err != nil {
			return nil, fmt.Errorf(`failed to get shipment by day. error: %w`, err)
		}
		return shipment, nil
	}

	shipment, err := s.repo.GetByPeriod(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get shipment by period. error: %w", err)
	}
	return shipment, nil
}

func (s *ShipmentService) Create(ctx context.Context, dto *models.Shipment) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create shipment. error: %w", err)
	}
	return nil
}

func (s *ShipmentService) CreateSeveral(ctx context.Context, dto []*models.Shipment) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several shipment. error: %w", err)
	}
	return nil
}

func (s *ShipmentService) UpdateSeveral(ctx context.Context, dto []*models.Shipment) error {
	if err := s.DeleteByDay(ctx, fmt.Sprintf("%d", dto[0].Date)); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, dto); err != nil {
		return err
	}
	return nil
}

func (s *ShipmentService) DeleteByDay(ctx context.Context, day string) error {
	if err := s.repo.DeleteByDay(ctx, day); err != nil {
		return fmt.Errorf("failed to delete shipment by day. error: %w", err)
	}
	return nil
}
