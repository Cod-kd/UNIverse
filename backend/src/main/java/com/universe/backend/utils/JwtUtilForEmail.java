package com.universe.backend.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JwtUtilForEmail {

    @Value("${jwt.secret.mail}")
    private String secret;

    private long verificationExpiration = 86400000; // 24 hours in milliseconds

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes()); // HMAC-SHA key from secret
    }

    public String generateVerificationToken(String email) {
        return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + verificationExpiration))
            .signWith(getSigningKey(), Jwts.SIG.HS256) // Explicit algorithm
            .compact();
    }

    public String validateVerificationToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token) // Parse signed JWT
                .getPayload(); // Get claims (payload)
            return claims.getSubject(); // Returns email
        } catch (ExpiredJwtException e) {
            System.out.println("Token expired: " + e.getMessage());
            return null;
        } catch (UnsupportedJwtException | MalformedJwtException | SignatureException | IllegalArgumentException e) {
            System.out.println("Invalid token: " + e.getMessage());
            return null;
        }
    }
}