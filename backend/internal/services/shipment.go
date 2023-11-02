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
	GetByPeriod(context.Context, models.Period) ([]models.Shipment, error)
	Create(context.Context, models.Shipment) error
	CreateSeveral(context.Context, []models.Shipment) error
	UpdateSeveral(context.Context, []models.Shipment) error
	DeleteByDay(context.Context, string) error
}

func (s *ShipmentService) GetByPeriod(ctx context.Context, period models.Period) (shipment []models.Shipment, err error) {
	if period.To == "" {
		shipment, err = s.repo.GetByDay(ctx, period.From)
		if err != nil {
			return nil, fmt.Errorf(`failed to get shipment by day. error: %w`, err)
		}
	} else {
		shipment, err = s.repo.GetByPeriod(ctx, period)
		if err != nil {
			return nil, fmt.Errorf("failed to get shipment by period. error: %w", err)
		}
	}

	return shipment, nil
}

func (s *ShipmentService) Create(ctx context.Context, shipment models.Shipment) error {
	if err := s.repo.Create(ctx, shipment); err != nil {
		return fmt.Errorf("failed to create shipment. error: %w", err)
	}
	return nil
}

func (s *ShipmentService) CreateSeveral(ctx context.Context, shipment []models.Shipment) error {
	if err := s.repo.CreateSeveral(ctx, shipment); err != nil {
		return fmt.Errorf("failed to create several shipment. error: %w", err)
	}
	return nil
}

func (s *ShipmentService) UpdateSeveral(ctx context.Context, shipment []models.Shipment) error {
	if err := s.DeleteByDay(ctx, shipment[0].Day); err != nil {
		return err
	}

	if err := s.CreateSeveral(ctx, shipment); err != nil {
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
