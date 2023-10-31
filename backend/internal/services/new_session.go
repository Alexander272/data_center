package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/pkg/auth"
)

type SessionService struct {
	// repo     repo.Session
	menu     Menu
	keycloak *auth.KeycloakClient
}

func NewSessionService(menu Menu, keycloak *auth.KeycloakClient) *SessionService {
	return &SessionService{
		menu:     menu,
		keycloak: keycloak,
	}
}

type Session interface {
	SignIn(ctx context.Context, u models.SignIn) (*models.User, error)
	SignOut(ctx context.Context, refreshToken string) error
	Refresh(ctx context.Context, refreshToken string) (*models.User, error)
	DecodeToken(ctx context.Context, token string) (user *models.User, err error)
}

func (s *SessionService) SignIn(ctx context.Context, u models.SignIn) (*models.User, error) {
	res, err := s.keycloak.Client.Login(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm, u.Username, u.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to login to keycloak. error: %w", err)
	}

	user, err := s.DecodeToken(ctx, res.AccessToken)
	if err != nil {
		return nil, err
	}

	menus, err := s.menu.GetByRole(ctx, user.Role)
	if err != nil {
		return nil, err
	}

	user.AccessToken = res.AccessToken
	user.RefreshToken = res.RefreshToken
	user.Menu = menus

	return user, nil
}

func (s *SessionService) SignOut(ctx context.Context, refreshToken string) error {
	if err := s.keycloak.Client.Logout(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm, refreshToken); err != nil {
		return fmt.Errorf("failed to to logout to keycloak. error: %w", err)
	}
	return nil
}

func (s *SessionService) Refresh(ctx context.Context, refreshToken string) (*models.User, error) {
	res, err := s.keycloak.Client.RefreshToken(ctx, refreshToken, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token in keycloak. error: %w", err)
	}

	user, err := s.DecodeToken(ctx, res.AccessToken)
	if err != nil {
		return nil, err
	}

	menus, err := s.menu.GetByRole(ctx, user.Role)
	if err != nil {
		return nil, err
	}

	user.AccessToken = res.AccessToken
	user.RefreshToken = res.RefreshToken
	user.Menu = menus

	return user, nil
}

func (s *SessionService) DecodeToken(ctx context.Context, token string) (user *models.User, err error) {
	_, claims, err := s.keycloak.Client.DecodeAccessToken(ctx, token, s.keycloak.Realm)
	if err != nil {
		return nil, fmt.Errorf("failed to decode access token. error: %w", err)
	}

	var role, username, userId string

	c := *claims
	access, ok := c["realm_access"]
	if ok {
		a := access.(map[string]interface{})["roles"]
		roles := a.([]interface{})
		for _, v := range roles {
			if strings.Contains(v.(string), "dashboard") {
				role = strings.Replace(v.(string), "dashboard_", "", 1)
				break
			}
		}
	}

	un, ok := c["preferred_username"]
	if ok {
		username = un.(string)
	}

	uId, ok := c["sub"]
	if ok {
		userId = uId.(string)
	}

	u := &models.User{
		Id:       userId,
		UserName: username,
		Role:     role,
	}

	return u, nil
}
