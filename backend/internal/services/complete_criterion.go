package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Alexander272/data_center/backend/internal/constants"
	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type CompleteCriterionService struct {
	repo      repo.CompleteCriterion
	role      Role
	criterion Criterions
}

func NewCompleteCriterionService(repo repo.CompleteCriterion, role Role, criterion Criterions) *CompleteCriterionService {
	return &CompleteCriterionService{
		repo:      repo,
		role:      role,
		criterion: criterion,
	}
}

type CompleteCriterion interface {
	GetByDate(context.Context, *models.GetCompeteDTO) ([]*models.Complete, error)
	Create(context.Context, *models.CompleteCriterionDTO) error
}

func (s *CompleteCriterionService) GetByDate(ctx context.Context, req *models.GetCompeteDTO) ([]*models.Complete, error) {
	role, err := s.role.Get(ctx, req.Role)
	if err != nil {
		return nil, err
	}

	items := []string{}
	for _, m := range role.Menu {
		parts := strings.Split(m, ":")
		if parts[1] == constants.Write && (len(items) == 0 || items[len(items)-1] != parts[0]) {
			items = append(items, parts[0])
		}
	}
	req.EnabledKeys = items
	// logger.Debug("GetByDate", logger.AnyAttr("EnabledKeys", items))

	criterions, err := s.criterion.GetAll(ctx, &models.CriterionParams{EnabledKeys: items})
	if err != nil {
		return nil, err
	}

	// criterionsGroup := map[string][]*models.Criterion{}
	// for _, c := range criterions {
	// 	arr := criterionsGroup[c.Type]
	// 	arr = append(arr, c)
	// 	criterionsGroup[c.Type] = arr
	// }
	criterionsGroup := map[string]int{}
	for _, c := range criterions {
		criterionsGroup[c.Type] += 1
	}
	// logger.Debug("GetByDate", logger.AnyAttr("criterionsGroup", criterionsGroup))

	data, err := s.repo.GetByDate(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get complete criterion by date. error: %w", err)
	}

	complete := []*models.Complete{}
	for _, d := range data {
		date := time.Unix(d.Date, 0)
		c := &models.Complete{Date: d.Date}

		count := criterionsGroup[constants.DailyCriterion] + criterionsGroup[constants.MonthlyCriterion]
		if int(date.Weekday())%6 != 0 {
			count += criterionsGroup[constants.InWeekdaysCriterion]
		}
		c.Complete = count == d.Count

		c.CompleteCount = d.Count
		c.Count = count

		complete = append(complete, c)
	}

	return complete, nil
}

func (s *CompleteCriterionService) Create(ctx context.Context, dto *models.CompleteCriterionDTO) error {
	candidate, err := s.repo.GetId(ctx, &models.GetOneCriterionDTO{CriterionId: dto.CriterionId, Date: dto.Date})
	if err != nil {
		return err
	}
	if candidate != "" {
		return nil
	}
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create complete criterion. error: %w", err)
	}
	return nil
}
