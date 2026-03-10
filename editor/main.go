package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed wwwroot
var rootDir embed.FS

type User struct {
	UserName string
}

func main() {
	r := gin.Default()
	authMiddleware, err := applyAuthMiddleware(r)

	gin_mode := os.Getenv("GIN_MODE")
	root, err := fs.Sub(rootDir, "wwwroot")
	if err != nil {
		log.Fatal(err)
	}

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path

		if strings.HasPrefix(path, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API route not found"})
			return
		}

		if gin_mode == "release" {
			http.FileServer(http.FS(root)).ServeHTTP(c.Writer, c.Request)
		} else {
			http.ServeFile(c.Writer, c.Request, "./wwwroot"+path)
		}
	})

	// if gin_mode == "release" {
	// 	r.StaticFS("/", http.FS(root))
	// } else {
	// 	r.Static("/", "./wwwroot")
	// }

	auth := r.Group("/api", authMiddleware.MiddlewareFunc())
	auth.GET("/user", func(ctx *gin.Context) {
		user, _ := ctx.Get("user")
		ctx.JSON(200, user)
	})

	r.Run(":8080")
}
