package com.davi.restaurante.config.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.davi.restaurante.exceptions.security.TokenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Component
public class TokenProvider {

    @Value("${app.jwt.key}")
    private String secret;

    @Value("${spring.application.name}")
    private String name;

    public String generationToken(String username) {
        try {
            return JWT.create()
                    .withIssuer(name)
                    .withSubject(username)
                    .withExpiresAt(expiration())
                    .sign(Algorithm.HMAC256(secret));
        } catch (JWTCreationException jwt) {
            throw new TokenException("Erro ao gerar token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Instant expiration() {
        return LocalDateTime.now().plusMinutes(120).toInstant(ZoneOffset.of("-03:00"));
    }

    public String checkToken(String token) {
        if (token == null)
            throw new TokenException("Token inválido ou não enviado", HttpStatus.BAD_REQUEST);

        try {
            return JWT.require(Algorithm.HMAC256(secret)).withIssuer(name).build().verify(token).getSubject();
        } catch (JWTVerificationException e) {
            throw new TokenException("Erro ao processar token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
