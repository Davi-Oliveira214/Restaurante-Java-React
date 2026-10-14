package com.davi.restaurante.exceptions.security;

import com.davi.restaurante.exceptions.RestauranteException;
import org.springframework.http.HttpStatus;

public class TokenException extends RestauranteException {
    public TokenException(String message) {
        super(message);
    }

    public TokenException(String message, HttpStatus status) {
        super(message, status);
    }
}
