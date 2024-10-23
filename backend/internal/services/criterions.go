package services

import (
	"context"
	"fmt"
	"time"

	"github.com/Alexander272/data_center/backend/internal/constants"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type CriterionsService struct {
	repo repo.Criterions
	role Role
}

func NewCriterionsService(repo repo.Criterions, role Role) *CriterionsService {
	return &CriterionsService{
		repo: repo,
		role: role,
	}
}

type Criterions interface {
	GetAll(context.Context, *models.CriterionParams) ([]*models.Criterion, error)
	GetByDate(context.Context, *models.GetCriterionDTO) ([]*models.CompleteCriterion, error)
	GetByDay(context.Context, models.User, string) ([]models.CompleteCriterion, error)
}

func (s *CriterionsService) GetAll(ctx context.Context, req *models.CriterionParams) ([]*models.Criterion, error) {
	criterions, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get all criterions. error: %w", err)
	}
	return criterions, nil
}

func (s *CriterionsService) GetByDate(ctx context.Context, req *models.GetCriterionDTO) ([]*models.CompleteCriterion, error) {
	// role, err := s.role.Get(ctx, req.Role)
	// if err != nil {
	// 	return nil, err
	// }

	// for ,  := range role.Menu {

	// }

	// req.EnabledKeys

	types := []string{constants.DailyCriterion, constants.WeeklyCriterion, constants.MonthlyCriterion}
	date := time.Unix(req.Date, 0)
	if int(date.Weekday())%6 != 0 {
		types = append(types, constants.InWeekdaysCriterion)
	}
	req.Types = types

	data, err := s.repo.GetByDate(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get criterion by date. error: %w", err)
	}
	return data, nil
}

func (s *CriterionsService) GetByDay(ctx context.Context, user models.User, day string) (criterions []models.CompleteCriterion, err error) {
	criterions, err = s.repo.GetByRole(ctx, user.Role, day)
	if err != nil {
		return nil, fmt.Errorf("failed to get criterions by role. error: %w", err)
	}

	return criterions, nil
}
