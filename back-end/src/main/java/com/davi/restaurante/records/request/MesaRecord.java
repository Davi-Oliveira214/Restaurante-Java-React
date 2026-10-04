package com.davi.restaurante.records.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record MesaRecord(@JsonProperty("codigo_mesa") @NotBlank String codigo) {
}