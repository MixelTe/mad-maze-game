package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

//go:embed wwwroot
var rootDir embed.FS
var Environment = "dev"

type User struct {
	UserName string `form:"username" json:"username" binding:"required"`
}

func main() {
	devMode := Environment == "dev"
	if !devMode {
		gin.SetMode(gin.ReleaseMode)
	}
	r := gin.Default()
	authMiddleware, err := applyAuthMiddleware(r)

	rootFS, err := fs.Sub(rootDir, "wwwroot")
	if err != nil {
		log.Fatal(err)
	}

	r.NoRoute(func(c *gin.Context) {
		path := c.Request.URL.Path

		if strings.HasPrefix(path, "/api") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API route not found"})
			return
		}

		if devMode {
			http.ServeFile(c.Writer, c.Request, "./wwwroot"+path)
		} else {
			http.FileServer(http.FS(rootFS)).ServeHTTP(c.Writer, c.Request)
		}
	})

	// if gin_mode == "release" {
	// 	r.StaticFS("/", http.FS(root))
	// } else {
	// 	r.Static("/", "./wwwroot")
	// }

	auth := r.Group("/api", authMiddleware.MiddlewareFunc())
	auth.GET("/me", func(ctx *gin.Context) {
		user, _ := ctx.Get("user")
		ctx.JSON(200, user)
	})

	r.Run(":8080")
}
