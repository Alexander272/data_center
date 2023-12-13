package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
)

type RoleService struct {
	repo repo.Role
}

func NewRoleService(repo repo.Role) *RoleService {
	return &RoleService{
		repo: repo,
	}
}

type Role interface {
	// GetAll(context.Context) ([]models.Role, error)
	GetWithApiPaths(context.Context) ([]models.RoleWithApi, error)
	Create(context.Context, models.RoleDTO) error
	Update(context.Context, models.RoleDTO) error
	Delete(context.Context, string) error
}

// func (s *RoleService) GetAll(ctx context.Context) ([]models.Role, error) {
// 	roles, err := s.repo.GetAll(ctx)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to get all roles. error: %w", err)
// 	}
// 	return roles, nil
// }

func (s *RoleService) GetWithApiPaths(ctx context.Context) ([]models.RoleWithApi, error) {
	roles, err := s.repo.GetWithApiPaths(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get roles with api path. error: %w", err)
	}
	return roles, nil
}

func (s *RoleService) Create(ctx context.Context, role models.RoleDTO) error {
	if err := s.repo.Create(ctx, role); err != nil {
		return fmt.Errorf("failed to create role. error: %w", err)
	}
	return nil
}

func (s *RoleService) Update(ctx context.Context, role models.RoleDTO) error {
	if err := s.repo.Update(ctx, role); err != nil {
		return fmt.Errorf("failed to update role. error: %w", err)
	}
	return nil
}

func (s *RoleService) Delete(ctx context.Context, id string) error {
	if err := s.repo.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete role. error: %w", err)
	}
	return nil
}
