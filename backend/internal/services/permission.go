package services

import "github.com/casbin/casbin/v2"

type PermissionService struct {
	adapter  Adapter
	enforcer casbin.IEnforcer
}

func NewPermissionService(adapter Adapter) *PermissionService {
	return &PermissionService{
		adapter: adapter,
	}
}

type Permission interface {
	LoadPolicy() error
}

// func (s *PermissionService) Init() {

// }

func (s *PermissionService) LoadPolicy() error {
	// model := s.enforcer.GetModel()

	// if err := s.adapter.LoadPolicy(model); err != nil {
	// 	return err
	// }
	// return nil

	if err := s.enforcer.LoadPolicy(); err != nil {
		return err
	}
	return nil
}
