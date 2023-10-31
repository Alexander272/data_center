package services

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
	"github.com/Alexander272/data_center/backend/pkg/auth"
)

type SessionService_old struct {
	repo            repo.Session
	menu            Menu
	keycloak        *auth.KeycloakClient
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
	// tokenManager    auth.TokenManager
}

func NewSessionService_old(repo repo.Session, menu Menu, keycloak *auth.KeycloakClient, accessTTL, refreshTTL time.Duration) *SessionService_old {
	return &SessionService_old{
		repo:            repo,
		menu:            menu,
		keycloak:        keycloak,
		accessTokenTTL:  accessTTL,
		refreshTokenTTL: refreshTTL,
		// tokenManager:    manager,
	}
}

type Session_old interface {
	SignIn(ctx context.Context, u models.SignIn) (models.User, string, error)
	// Refresh(ctx context.Context, user models.User) (models.User, string, error)
	SingOut(ctx context.Context, token string) error
	Refresh(ctx context.Context, token string) (models.User, string, error)
	// CheckSession(ctx context.Context, token string) (bool, error)
	DecodeToken(ctx context.Context, token string) (models.User, error)
	// TokenParse(token string) (user models.User, err error)
}

func (s *SessionService_old) SignIn(ctx context.Context, u models.SignIn) (models.User, string, error) {
	// user, err := s.user.GetByName(ctx, u)
	// if err != nil {
	// 	return models.User{}, "", err
	// }

	token, err := s.keycloak.Client.Login(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm, u.Username, u.Password)
	if err != nil {
		return models.User{}, "", fmt.Errorf("failed to login to keycloak. error: %w", err)
	}

	user, err := s.DecodeToken(ctx, token.AccessToken)
	if err != nil {
		return models.User{}, "", err
	}

	// token.IDToken

	refreshData := models.SessionData{
		UserId:       user.Id,
		UserName:     user.UserName,
		Role:         user.Role,
		RefreshToken: token.RefreshToken,
		Exp:          s.refreshTokenTTL,
	}
	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", token.AccessToken), refreshData); err != nil {
		return models.User{}, "", fmt.Errorf("failed to create session (refresh). error: %w", err)
	}

	menus, err := s.menu.GetByRole(ctx, user.Role)
	if err != nil {
		return models.User{}, "", err
	}
	user.Menu = menus

	return user, token.AccessToken, nil
}

// func (s *SessionService) Refresh(ctx context.Context, user models.User) (models.User, string, error) {
// 	_, accessToken, err := s.tokenManager.NewJWT(user.Id, user.Role, s.accessTokenTTL)
// 	if err != nil {
// 		return models.User{}, "", err
// 	}
// 	refreshToken, err := s.tokenManager.NewRefreshToken()
// 	if err != nil {
// 		return models.User{}, "", err
// 	}

// 	accessData := models.SessionData{
// 		UserId:      user.Id,
// 		UserName:    user.UserName,
// 		Sector:      user.Sector,
// 		Role:        user.Role,
// 		AccessToken: accessToken,
// 		Exp:         s.accessTokenTTL,
// 	}
// 	if err := s.repo.Create(ctx, refreshToken, accessData); err != nil {
// 		return models.User{}, "", fmt.Errorf("failed to create session. error: %w", err)
// 	}

// 	refreshData := models.SessionData{
// 		UserId:       user.Id,
// 		UserName:     user.UserName,
// 		Sector:       user.Sector,
// 		Role:         user.Role,
// 		AccessToken:  accessToken,
// 		RefreshToken: refreshToken,
// 		Exp:          s.refreshTokenTTL,
// 	}
// 	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", accessToken), refreshData); err != nil {
// 		return models.User{}, "", fmt.Errorf("failed to create session (refresh). error: %w", err)
// 	}

// 	retUser := models.User{
// 		Id:   user.Id,
// 		Role: user.Role,
// 	}

// 	return retUser, accessToken, nil
// }

func (s *SessionService_old) SingOut(ctx context.Context, token string) error {
	// err := s.repo.Remove(ctx, token)
	// if err != nil {
	// 	return fmt.Errorf("failed to delete session. error: %w", err)
	// }

	refresh, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return fmt.Errorf("failed to get session (refresh). error: %w", err)
	}

	err = s.repo.Remove(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return fmt.Errorf("failed to delete session (refresh). error: %w", err)
	}

	// s.keycloak.Client.LogoutUserSession()

	if err := s.keycloak.Client.Logout(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm, refresh.RefreshToken); err != nil {
		return fmt.Errorf("failed to logout to keycloak. error: %w", err)
	}

	return nil
}

func (s *SessionService_old) Refresh(ctx context.Context, token string) (models.User, string, error) {
	refresh, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return models.User{}, "", fmt.Errorf("failed to get session (refresh). error: %w", err)
	}

	err = s.repo.Remove(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return models.User{}, "", fmt.Errorf("failed to delete session (refresh). error: %w", err)
	}

	newToken, err := s.keycloak.Client.RefreshToken(ctx, refresh.RefreshToken, s.keycloak.ClientId, s.keycloak.ClientSecret, s.keycloak.Realm)
	if err != nil {
		return models.User{}, "", fmt.Errorf("failed to refresh token to keycloak. error: %w", err)
	}

	user, err := s.DecodeToken(ctx, newToken.AccessToken)
	if err != nil {
		return models.User{}, "", err
	}

	refreshData := models.SessionData{
		UserId:       user.Id,
		UserName:     user.UserName,
		Role:         user.Role,
		RefreshToken: newToken.RefreshToken,
		Exp:          s.refreshTokenTTL,
	}
	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", newToken.AccessToken), refreshData); err != nil {
		return models.User{}, "", fmt.Errorf("failed to create session (refresh). error: %w", err)
	}

	menus, err := s.menu.GetByRole(ctx, user.Role)
	if err != nil {
		return models.User{}, "", err
	}
	user.Menu = menus

	return user, newToken.AccessToken, nil
}

// func (s *SessionService) CheckSession(ctx context.Context, token string) (bool, error) {
// 	refreshUser, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", token))
// 	if err != nil {
// 		return false, fmt.Errorf("failed to get session (refresh). error: %w", err)
// 	}

// 	user, err := s.repo.Get(ctx, refreshUser.RefreshToken)
// 	if err != nil && !errors.Is(err, models.ErrSessionEmpty) {
// 		return false, fmt.Errorf("failed to get session. error: %w", err)
// 	}

// 	if user.AccessToken != token && refreshUser.AccessToken != token {
// 		return false, models.ErrToken
// 	}

// 	if user.UserId == "" {
// 		return true, nil
// 	}
// 	return false, nil
// }

func (s *SessionService_old) DecodeToken(ctx context.Context, token string) (user models.User, err error) {
	_, claims, err := s.keycloak.Client.DecodeAccessToken(ctx, token, s.keycloak.Realm)
	if err != nil {
		return models.User{}, fmt.Errorf("failed to decode access token. error: %w", err)
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

	u := models.User{
		Id:       userId,
		UserName: username,
		Role:     role,
	}

	return u, nil
}

// func (s *SessionService) TokenParse(token string) (user models.User, err error) {
// 	claims, err := s.tokenManager.Parse(token)
// 	if err != nil {
// 		return user, err
// 	}

// 	user = models.User{
// 		Id:       claims["userId"].(string),
// 		UserName: claims["userName"].(string),
// 		Sector:   claims["sector"].(string),
// 		Role:     claims["role"].(string),
// 	}

// 	return user, nil
// }
