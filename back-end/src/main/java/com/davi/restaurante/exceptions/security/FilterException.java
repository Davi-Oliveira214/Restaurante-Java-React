package com.davi.restaurante.exceptions.security;

import com.davi.restaurante.exceptions.RestauranteException;
import org.springframework.http.HttpStatus;

public class FilterException extends RestauranteException {
    public FilterException(String message) {
        super(message);
    }

    public FilterException(String message, HttpStatus status) {
        super(message, status);
    }
}
