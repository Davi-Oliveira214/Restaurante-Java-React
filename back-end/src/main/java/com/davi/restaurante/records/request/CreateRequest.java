package com.davi.restaurante.records.request;

import jakarta.validation.constraints.NotBlank;

public record CreateRequest(@NotBlank String nome, @NotBlank String email, @NotBlank String password,
                            @NotBlank String repita_password) {
}
