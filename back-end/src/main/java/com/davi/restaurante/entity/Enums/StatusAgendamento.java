package com.davi.restaurante.entity.Enums;

public enum StatusAgendamento {
    CANCELADO("cancelado"),
    AGUARDANDO("aguardando"),
    CONFIRMADO("confirmado");

    private final String status;

    StatusAgendamento(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
