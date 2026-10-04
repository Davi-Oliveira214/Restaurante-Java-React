package com.davi.restaurante.records.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public record MesaRecord(@JsonProperty("mesa_id") @NotNull Long numero) {
}