package com.davi.restaurante.records.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AgendamentoRecord(@NotNull Long userId, @NotNull LocalDateTime data, @NotNull int duracao,
                                @JsonProperty("mesa") @NotNull Long mesa) {
}