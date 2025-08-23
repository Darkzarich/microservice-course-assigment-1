package request

import (
	"encoding/json"
	"log"
	"net/http"
)

type APIError struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// APIError implements the error interface.
func (e APIError) Error() string {
	return e.Message
}

type Handler func(w http.ResponseWriter, r *http.Request) error

func SendJSON(w http.ResponseWriter, status int, data interface{}) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(data)
}

func SendError(w http.ResponseWriter, apiErr APIError) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(apiErr.StatusCode)
	json.NewEncoder(w).Encode(apiErr)
}

func HandleAPIError(handler Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Log request
		log.Println("Request received", r.Method, r.URL.Path)

		if err := handler(w, r); err != nil {
			if apiErr, ok := err.(APIError); ok {
				SendError(w, apiErr)
			} else {
				log.Printf("Internal server error: %v", err)
				SendError(w, APIError{
					StatusCode: http.StatusInternalServerError,
					Message:    "Internal server error",
				})
			}
		}
	}
}
