package casbin

import (
	"context"
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/casbin/casbin/v2/model"
	"github.com/casbin/casbin/v2/persist"
)

type PolicyAdapter struct {
	role services.Role
	user services.User
}

func NewPolicyAdapter(role services.Role, user services.User) *PolicyAdapter {
	return &PolicyAdapter{
		role: role,
		user: user,
	}
}

type Adapter interface {
	LoadPolicy(model model.Model) error
	SavePolicy(model model.Model) error
	AddPolicy(sec string, ptype string, rule []string) error
	RemovePolicy(sec string, ptype string, rule []string) error
	RemoveFilteredPolicy(sec string, ptype string, fieldIndex int, fieldValues ...string) error
}

func (s *PolicyAdapter) LoadPolicy(model model.Model) error {
	if err := s.loadRolePolicy(model); err != nil {
		return err
	}

	// if err := s.loadUserPolicy(model); err != nil {
	// 	return err
	// }

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

// func (s *PolicyAdapter) loadUserPolicy(model model.Model) error {
// 	users, err := s.user.GetAll(context.Background())
// 	if err != nil {
// 		return err
// 	}

// 	for _, us := range users {
// 		line := fmt.Sprintf("g, %s, %s", us.UserName, us.Role)
// 		if err := persist.LoadPolicyLine(line, model); err != nil {
// 			return fmt.Errorf("failed to load user policy. error: %w", err)
// 		}
// 	}
// 	return nil
// }

// SavePolicy saves all policy rules to the storage.
func (a *PolicyAdapter) SavePolicy(model model.Model) error {
	return nil
}

// AddPolicy adds a policy rule to the storage.
// This is part of the Auto-Save feature.
func (a *PolicyAdapter) AddPolicy(sec string, ptype string, rule []string) error {
	return nil
}

// RemovePolicy removes a policy rule from the storage.
// This is part of the Auto-Save feature.
func (a *PolicyAdapter) RemovePolicy(sec string, ptype string, rule []string) error {
	return nil
}

// RemoveFilteredPolicy removes policy rules that match the filter from the storage.
// This is part of the Auto-Save feature.
func (a *PolicyAdapter) RemoveFilteredPolicy(sec string, ptype string, fieldIndex int, fieldValues ...string) error {
	return nil
}
