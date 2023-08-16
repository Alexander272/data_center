package casbin

import (
	"fmt"

	"github.com/Alexander272/data_center/backend/internal/services"
	"github.com/casbin/casbin/v2"
)

type CasbinService struct {
	enforcer casbin.IEnforcer
}

type Casbin interface {
	Register(role services.Role, user services.User, path string) (*CasbinService, error)
	Enforce(params ...interface{}) (bool, error)
}

func NewCasbinService(role services.Role, user services.User, path string) *CasbinService {
	casbin := &CasbinService{}
	casbin.Register(role, user, path)

	return casbin
}

func (s *CasbinService) Register(role services.Role, user services.User, path string) (*CasbinService, error) {
	var err error
	adapter := NewPolicyAdapter(role, user)

	s.enforcer, err = casbin.NewEnforcer(path, adapter)
	if err != nil {
		return nil, fmt.Errorf("failed to create enforcer. error: %w", err)
	}

	if err = s.enforcer.LoadPolicy(); err != nil {
		return nil, fmt.Errorf("failed to load policy. error: %w", err)
	}

	return &CasbinService{}, nil
}

func (s *CasbinService) Enforce(params ...interface{}) (bool, error) {
	return s.enforcer.Enforce(params...)
}
