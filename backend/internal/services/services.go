package services

import (
	"time"

	"github.com/Alexander272/data_center/backend/internal/repo"
	"github.com/Alexander272/data_center/backend/pkg/auth"
	"github.com/Alexander272/data_center/backend/pkg/hasher"
)

type Services struct {
	Session
	Role
	User
}

type Deps struct {
	Repos           *repo.Repo
	TokenManager    auth.TokenManager
	Keycloak        *auth.KeycloakClient
	Hasher          hasher.PasswordHasher
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
}

func NewServices(deps Deps) *Services {
	menu := NewMenuService(deps.Repos.Menu)
	role := NewRoleService(deps.Repos.Role)
	user := NewUserService(deps.Repos.User)

	session := NewSessionService(deps.Repos.Session, menu, deps.Keycloak, deps.TokenManager, deps.AccessTokenTTL, deps.RefreshTokenTTL)

	return &Services{
		Session: session,
		Role:    role,
		User:    user,
	}
}
