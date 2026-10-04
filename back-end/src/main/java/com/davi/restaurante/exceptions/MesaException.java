package com.davi.restaurante.exceptions;

import org.springframework.http.HttpStatus;

public class MesaException extends RestauranteException {

    public MesaException() {
        super("Nenhuma mesa encontrada", HttpStatus.NOT_FOUND);
    }

    public MesaException(String message, HttpStatus status) {
        super(message, status);
    }
}
