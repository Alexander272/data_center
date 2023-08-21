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

	return &KeycloakClient{
		Client:       client,
		ClientId:     clientId,
		ClientSecret: clientSecret,
		Realm:        realm,
	}
}
