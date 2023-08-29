package auth

import "github.com/Nerzal/gocloak/v13"

type KeycloakClient struct {
	Client       *gocloak.GoCloak // keycloak client
	ClientId     string           // clientId specified in Keycloak
	ClientSecret string           // client secret specified in Keycloak
	Realm        string           // realm specified in Keycloak
}

func NewKeycloakClient(url, clientId, clientSecret, realm string) *KeycloakClient {
	client := gocloak.NewClient(url)

	// token, err := client.LoginAdmin(context.Background(), login, password, realm)
	// if err != nil {
	// 	logger.Fatalf("failed to login admin to keycloak. error: %s", err.Error())
	// }

	// secret, err := client.GetClientSecret(context.Background(), token.AccessToken, realm, clientId)
	// if err != nil {
	// 	logger.Fatalf("failed to get secret to keycloak. error: %s", err.Error())
	// }
	// logger.Debug(secret)

	return &KeycloakClient{
		Client:       client,
		ClientId:     clientId,
		ClientSecret: clientSecret,
		Realm:        realm,
	}
}
