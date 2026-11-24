package database

import (
    "context"
    "fmt"
    "os"
    "time"

    "github.com/jackc/pgx/v5/pgxpool"
)

func Connect() (*pgxpool.Pool, error) {
    host := os.Getenv("DB_HOST")
    port := os.Getenv("DB_PORT")
    name := os.Getenv("DB_NAME")
    user := os.Getenv("DB_USER")
    password := os.Getenv("DB_PASSWORD")
    sslMode := os.Getenv("DB_SSLMODE")
    rootCert := os.Getenv("DB_SSLROOTCERT")

    if host == "" || name == "" || user == "" || password == "" {
        return nil, fmt.Errorf("database configuration is incomplete")
    }

    dsn := fmt.Sprintf(
        "host=%s port=%s dbname=%s user=%s password=%s sslmode=%s sslrootcert=%s",
        host, port, name, user, password, sslMode, rootCert,
    )

    config, err := pgxpool.ParseConfig(dsn)
    if err != nil {
        return nil, fmt.Errorf("database config error: %w", err)
    }

    // Keep connections low for the small RDS instance.
    config.MaxConns = 5
    config.MinConns = 0
    config.MaxConnLifetime = time.Hour
    config.MaxConnIdleTime = 15 * time.Minute

    ctx, cancel := context.WithTimeout(
        context.Background(), 10*time.Second,
    )
    defer cancel()

    pool, err := pgxpool.NewWithConfig(ctx, config)
    if err != nil {
        return nil, fmt.Errorf("database connection error: %w", err)
    }

    if err := pool.Ping(ctx); err != nil {
        pool.Close()
        return nil, fmt.Errorf("database ping failed: %w", err)
    }

    return pool, nil
}
