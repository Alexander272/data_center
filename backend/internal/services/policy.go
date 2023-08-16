package services

import (
	"context"
	"fmt"

	"github.com/casbin/casbin/v2/model"
	"github.com/casbin/casbin/v2/persist"
)

type PolicyAdapter struct {
	role Role
	user User
}

func NewPolicyAdapter(role Role, user User) *PolicyAdapter {
	return &PolicyAdapter{
		role: role,
		user: user,
	}
}

type Adapter interface {
	LoadPolicy(model model.Model) error
}

func (s *PolicyAdapter) LoadPolicy(model model.Model) error {
	if err := s.loadRolePolicy(model); err != nil {
		return err
	}

	if err := s.loadUserPolicy(model); err != nil {
		return err
	}

	return nil
}

func (s *PolicyAdapter) loadRolePolicy(model model.Model) error {
	roles, err := s.role.GetAll(context.Background())
	if err != nil {
		return err
	}

	for _, r := range roles {
		for _, m := range r.Menus {
			if m.Path == "" || m.Method == "" {
				continue
			}

			line := fmt.Sprintf("p, %s, %s, %s", r.Name, m.Path, m.Method)
			if err := persist.LoadPolicyLine(line, model); err != nil {
				return fmt.Errorf("failed to load role policy. error: %w", err)
			}
		}
	}
	return nil
}

func (s *PolicyAdapter) loadUserPolicy(model model.Model) error {
	users, err := s.user.GetAll(context.Background())
	if err != nil {
		return err
	}

	for _, us := range users {
		line := fmt.Sprintf("g, %s, %s", us.UserName, us.Role)
		if err := persist.LoadPolicyLine(line, model); err != nil {
			return fmt.Errorf("failed to load user policy. error: %w", err)
		}
	}
	return nil
}
