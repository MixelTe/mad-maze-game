package main

import (
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/appleboy/gin-jwt/v3"
	jwtcore "github.com/appleboy/gin-jwt/v3/core"
	"github.com/gin-gonic/gin"
	gjwt "github.com/golang-jwt/jwt/v5"
)

type login struct {
	Login string `form:"login" json:"login" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
}

func applyAuthMiddleware(r *gin.Engine) (*jwt.GinJWTMiddleware, error) {
	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("JWT_SECRET is not set")
	}

	authMiddleware, err := jwt.New(&jwt.GinJWTMiddleware{
		Realm:          "abc",
		Key:            []byte(jwtSecret),
		TokenLookup:    "cookie:jwt",
		Timeout:        time.Hour,
		MaxRefresh:     time.Hour * 24 * 7,
		SecureCookie:   true,
		CookieHTTPOnly: true,
		CookieSameSite: http.SameSiteStrictMode,
		SendCookie:     true,
		IdentityKey:    "user",
		PayloadFunc: func(data any) gjwt.MapClaims {
			if v, ok := data.(*User); ok {
				return gjwt.MapClaims{"user": v.UserName}
			}
			return gjwt.MapClaims{}
		},
		IdentityHandler: func(ctx *gin.Context) any {
			claims := jwt.ExtractClaims(ctx)
			return &User{
				UserName: claims["user"].(string),
			}
		},
		Authenticator: func(c *gin.Context) (any, error) {
			var loginVals login
			if err := c.ShouldBind(&loginVals); err != nil {
				log.Printf("Authentication bind error: %v", err)
				return nil, jwt.ErrMissingLoginValues
			}

			// user, err := database.Verify(loginVals.Username, loginVals.Password)
			// if err != nil {
			// 	return nil, jwt.ErrFailedAuthentication
			// }
			user := User{UserName: "admin"}

			c.Set("user_data", user)
			return &user, nil
		},
		LoginResponse: func(c *gin.Context, token *jwtcore.Token) {
			userData, _ := c.Get("user_data")
			c.JSON(200, userData)
		},
	})
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
		return nil, err
	}

	errInit := authMiddleware.MiddlewareInit()
	if errInit != nil {
		log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
		return nil, errInit
	}

	r.POST("/api/login", authMiddleware.LoginHandler)
	r.POST("/api/refresh", authMiddleware.RefreshHandler)

	auth := r.Group("/", authMiddleware.MiddlewareFunc())
	auth.POST("/api/logout", authMiddleware.LogoutHandler)

	return authMiddleware, nil
}
