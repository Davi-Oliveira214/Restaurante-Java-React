package com.davi.restaurante.records.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRecord(@NotNull LocalDateTime data, @NotNull int duracao, @NotNull Long mesa) {
}