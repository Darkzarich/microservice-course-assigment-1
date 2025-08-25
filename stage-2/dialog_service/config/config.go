package config

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Hostname     string
	Port         string
	JWTSecret    []byte
	PostgresHost string
	PostgresPort uint16
	PostgresUser string
	PostgresPass string
	PostgresDB   string
}

const (
	envFile             = ".env"
	defaultHostname     = "localhost"
	defaultPort         = "3000"
	defaultJWTSecret    = "secret"
	defaultPostgresHost = "localhost"
	defaultPostgresPort = 5432
	defaultPostgresUser = "postgres"
	defaultPostgresPass = "mysecretpassword"
	defaultPostgresDB   = "assignment_1"
	BearerPrefix        = "Bearer "
)

func InitConfig() (*Config, error) {
	if err := godotenv.Load(envFile); err != nil {
		log.Println(".env file not found, proceeding with defaults")
	}

	port := getEnv("PORT", defaultPort)
	hostname := getEnv("HOSTNAME", defaultHostname)
	jwtSecret := getEnv("JWT_SECRET", defaultJWTSecret)
	postgresHost := getEnv("POSTGRES_HOST", defaultPostgresHost)
	postgresPort, err := strconv.ParseUint(getEnv("PGPORT", strconv.Itoa(defaultPostgresPort)), 10, 16)
	if err != nil {
		return nil, fmt.Errorf("invalid PGPORT: %w", err)
	}
	postgresUser := getEnv("POSTGRES_USER", defaultPostgresUser)
	postgresPass := getEnv("POSTGRES_PASSWORD", defaultPostgresPass)
	postgresDB := getEnv("POSTGRES_DB", defaultPostgresDB)

	return &Config{
		Hostname:     hostname,
		Port:         port,
		JWTSecret:    []byte(jwtSecret),
		PostgresHost: postgresHost,
		PostgresPort: uint16(postgresPort),
		PostgresUser: postgresUser,
		PostgresPass: postgresPass,
		PostgresDB:   postgresDB,
	}, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
