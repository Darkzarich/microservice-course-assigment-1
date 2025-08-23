package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"dialog_service/config"
	"dialog_service/database"
	"dialog_service/request"

	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	db *pgxpool.Pool
)

func main() {
	var err error
	cfg, err := config.InitConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	log.SetPrefix(fmt.Sprintf("[host=%s] ", cfg.Hostname))

	log.Println("Starting dialog service...")
	log.Println("Connecting to database...")

	db, err = database.CreateDBPool(cfg)
	if err != nil {
		log.Fatalf("Unable to create connection pool: %v", err)
	}
	defer db.Close()

	// Test the connection to the database
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Unable to ping database: %v", err)
	}
	log.Println("Database connection successful")

	mux := http.NewServeMux()

	mux.Handle("GET /api/dialog/{id}/list", authMiddleware(cfg, request.HandleAPIError(listDialogs)))
	mux.Handle("POST /api/dialog/{id}/send", authMiddleware(cfg, request.HandleAPIError(sendMessage)))

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Printf("Listening on port %s...", cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("Server failed: %v", err)
	}
}
