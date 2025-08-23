package main

import (
	"context"
	"dialog_service/config"
	"dialog_service/request"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func parseID(r *http.Request) (int, error) {
	idStr := r.PathValue("id")
	id, err := strconv.Atoi(idStr)

	if err != nil {
		return 0, fmt.Errorf("invalid id: %w", err)
	}

	return id, nil
}

type Message struct {
	From      int       `json:"from"`
	To        int       `json:"to"`
	Text      string    `json:"text"`
	CreatedAt time.Time `json:"created_at"`
}

func listDialogs(w http.ResponseWriter, r *http.Request) error {
	currentUser, ok := r.Context().Value(jwtClaimsKey).(*User)
	if !ok {
		return request.APIError{StatusCode: http.StatusInternalServerError, Message: "User not found in context"}
	}

	targetUserId, err := parseID(r)
	if err != nil {
		return request.APIError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	rows, err := db.Query(ctx, `
		SELECT "from", "to", text, created_at 
		FROM messages 
		WHERE ("to" = $1 AND "from" = $2) OR ("from" = $1 AND "to" = $2)
		ORDER BY created_at`,
		currentUser.ID, targetUserId,
	)
	if err != nil {
		return fmt.Errorf("database query failed: %w", err)
	}
	defer rows.Close()

	messages := make([]Message, 0)
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.From, &msg.To, &msg.Text, &msg.CreatedAt); err != nil {
			return fmt.Errorf("failed to scan message: %w", err)
		}
		messages = append(messages, msg)
	}

	if err := rows.Err(); err != nil {
		return fmt.Errorf("rows error: %w", err)
	}

	return request.SendJSON(w, http.StatusOK, messages)
}

type SentMessage struct {
	Text string `json:"text"`
}

func sendMessage(w http.ResponseWriter, r *http.Request) error {
	currentUser, ok := r.Context().Value(jwtClaimsKey).(*User)
	if !ok {
		return request.APIError{StatusCode: http.StatusInternalServerError, Message: "User not found in context"}
	}

	targetUserId, err := parseID(r)
	if err != nil {
		return request.APIError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}

	var message SentMessage

	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return request.APIError{StatusCode: http.StatusBadRequest, Message: err.Error()}
	}

	_, err = db.Exec(r.Context(), `INSERT INTO messages ("from", "to", text) VALUES ($1, $2, $3)`, currentUser.ID, targetUserId, message.Text)

	if err != nil {
		return fmt.Errorf("database query failed: %w", err)
	}

	return request.SendJSON(w, http.StatusCreated, SentMessage{Text: message.Text})
}

type User struct {
	ID int `json:"id"`
	jwt.RegisteredClaims
}

type jwtClaimsKeyType string

const jwtClaimsKey jwtClaimsKeyType = "user"

func authMiddleware(cfg *config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			request.SendError(w, request.APIError{StatusCode: http.StatusUnauthorized, Message: "Authorization header required"})
			return
		}

		if !strings.HasPrefix(authHeader, config.BearerPrefix) {
			request.SendError(w, request.APIError{StatusCode: http.StatusUnauthorized, Message: "Authorization header must start with Bearer"})
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, config.BearerPrefix)
		user := &User{}

		token, err := jwt.ParseWithClaims(tokenStr, user, func(token *jwt.Token) (interface{}, error) {
			return cfg.JWTSecret, nil
		})

		if err != nil || !token.Valid {
			request.SendError(w, request.APIError{StatusCode: http.StatusUnauthorized, Message: "Invalid token"})
			return
		}

		ctx := context.WithValue(r.Context(), jwtClaimsKey, user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
