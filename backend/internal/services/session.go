package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Alexander272/data_center/backend/internal/models"
	"github.com/Alexander272/data_center/backend/internal/repo"
	"github.com/Alexander272/data_center/backend/pkg/auth"
)

type SessionService struct {
	repo            repo.Session
	user            User
	tokenManager    auth.TokenManager
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
}

func NewSessionService(repo repo.Session, user User, manager auth.TokenManager, accessTTL, refreshTTL time.Duration) *SessionService {
	return &SessionService{
		repo:            repo,
		user:            user,
		tokenManager:    manager,
		accessTokenTTL:  accessTTL,
		refreshTokenTTL: refreshTTL,
	}
}

type Session interface {
	SignIn(ctx context.Context, u models.SignIn) (models.User, string, error)
	Refresh(ctx context.Context, user models.User) (models.User, string, error)
	SingOut(ctx context.Context, token string) error
	CheckSession(ctx context.Context, token string) (bool, error)
	TokenParse(token string) (user models.User, err error)
}

func (s *SessionService) SignIn(ctx context.Context, u models.SignIn) (models.User, string, error) {
	user, err := s.user.GetByName(ctx, u)
	if err != nil {
		return models.User{}, "", err
	}

	return s.Refresh(ctx, user)
}

func (s *SessionService) Refresh(ctx context.Context, user models.User) (models.User, string, error) {
	_, accessToken, err := s.tokenManager.NewJWT(user.Id, user.Role, s.accessTokenTTL)
	if err != nil {
		return models.User{}, "", err
	}
	refreshToken, err := s.tokenManager.NewRefreshToken()
	if err != nil {
		return models.User{}, "", err
	}

	accessData := models.SessionData{
		UserId:      user.Id,
		UserName:    user.UserName,
		Sector:      user.Sector,
		Role:        user.Role,
		AccessToken: accessToken,
		Exp:         s.accessTokenTTL,
	}
	if err := s.repo.Create(ctx, refreshToken, accessData); err != nil {
		return models.User{}, "", fmt.Errorf("failed to create session. error: %w", err)
	}

	refreshData := models.SessionData{
		UserId:       user.Id,
		UserName:     user.UserName,
		Sector:       user.Sector,
		Role:         user.Role,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Exp:          s.refreshTokenTTL,
	}
	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", accessToken), refreshData); err != nil {
		return models.User{}, "", fmt.Errorf("failed to create session (refresh). error: %w", err)
	}

	retUser := models.User{
		Id:   user.Id,
		Role: user.Role,
	}

	return retUser, accessToken, nil
}

func (s *SessionService) SingOut(ctx context.Context, token string) error {
	err := s.repo.Remove(ctx, token)
	if err != nil {
		return fmt.Errorf("failed to delete session. error: %w", err)
	}

	err = s.repo.Remove(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return fmt.Errorf("failed to delete session (refresh). error: %w", err)
	}

	return nil
}

func (s *SessionService) CheckSession(ctx context.Context, token string) (bool, error) {
	refreshUser, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", token))
	if err != nil {
		return false, fmt.Errorf("failed to get session (refresh). error: %w", err)
	}

	user, err := s.repo.Get(ctx, refreshUser.RefreshToken)
	if err != nil && !errors.Is(err, models.ErrSessionEmpty) {
		return false, fmt.Errorf("failed to get session. error: %w", err)
	}

	if user.AccessToken != token && refreshUser.AccessToken != token {
		return false, models.ErrToken
	}

	if user.UserId == "" {
		return true, nil
	}
	return false, nil
}

func (s *SessionService) TokenParse(token string) (user models.User, err error) {
	claims, err := s.tokenManager.Parse(token)
	if err != nil {
		return user, err
	}

	user = models.User{
		Id:       claims["userId"].(string),
		UserName: claims["userName"].(string),
		Sector:   claims["sector"].(string),
		Role:     claims["role"].(string),
	}

	return user, nil
}