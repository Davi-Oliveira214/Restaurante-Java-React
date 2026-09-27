package com.davi.restaurante.records.request;

import jakarta.validation.constraints.NotNull;

public record CadastroRecord(@NotNull String nome, @NotNull String email,
                             @NotNull String senha, @NotNull String repita_senha) {
}