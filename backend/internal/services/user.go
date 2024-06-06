package services

type UserService struct {
	// repo repo.User
}

func NewUserService() *UserService {
	return &UserService{
		// repo: repo,
	}
}

type User interface {
	// GetAll(context.Context) ([]models.UserShort, error)
	// GetById(context.Context, string) (models.User, error)
	// GetByName(context.Context, models.SignIn) (models.User, error)
	// Create(context.Context, models.UserDTO) error
	// Update(context.Context, models.UserDTO) error
	// Delete(context.Context, string) error
}

// func (s *UserService) GetAll(ctx context.Context) ([]models.UserShort, error) {
// 	users, err := s.repo.GetAll(ctx)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to get all users. error: %w", err)
// 	}
// 	return users, nil
// }

// func (s *UserService) GetById(ctx context.Context, id string) (models.User, error) {
// 	user, err := s.repo.GetById(ctx, id)
// 	if err != nil {
// 		return models.User{}, fmt.Errorf("failed to get user by id. error: %w", err)
// 	}
// 	return user, nil
// }

// func (s *UserService) GetByName(ctx context.Context, user models.SignIn) (models.User, error) {
// 	return models.User{}, fmt.Errorf("not implemented")
// }

// func (s *UserService) Create(ctx context.Context, user models.UserDTO) error {
// 	if err := s.repo.Create(ctx, user); err != nil {
// 		return fmt.Errorf("failed to create user. error: %w", err)
// 	}
// 	return nil
// }

// func (s *UserService) Update(ctx context.Context, user models.UserDTO) error {
// 	if err := s.repo.Update(ctx, user); err != nil {
// 		return fmt.Errorf("failed to update user. error: %w", err)
// 	}
// 	return nil
// }

// func (s *UserService) Delete(ctx context.Context, id string) error {
// 	if err := s.repo.Delete(ctx, id); err != nil {
// 		return fmt.Errorf("failed to delete user. error: %w", err)
// 	}
// 	return nil
// }
