
package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
    "time"
	"context"

    "github.com/go-chi/chi/v5"
    "github.com/go-chi/cors"
    "github.com/joho/godotenv"

    "college-erp/backend/database"
)

func main() {
    _ = godotenv.Load()

    db, err := database.Connect()
    if err != nil {
        log.Fatal("Database connection failed:", err)
    }
    defer db.Close()

    log.Println("PostgreSQL connected successfully")

    router := chi.NewRouter()

    router.Use(cors.Handler(cors.Options{
        AllowedOrigins: []string{
            "http://localhost:5173",
        },
        AllowedMethods: []string{
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS",
        },
        AllowedHeaders: []string{
            "Accept", "Authorization", "Content-Type",
        },
        MaxAge: 300,
    }))

    router.Get("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]interface{}{
            "success": true,
            "message": "College ERP API is running",
        })
    })

    router.Get("/api/v1/db-health", func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
        defer cancel()

        if err := db.Ping(ctx); err != nil {
            http.Error(w, "Database unavailable", http.StatusServiceUnavailable)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]interface{}{
            "success": true,
            "message": "PostgreSQL connected successfully",
        })
    })

    port := os.Getenv("APP_PORT")
    if port == "" {
        port = "8080"
    }

    log.Println("College ERP API running on port", port)
    log.Fatal(http.ListenAndServe(":"+port, router))
}     