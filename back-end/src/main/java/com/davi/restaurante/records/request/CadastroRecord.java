package com.davi.restaurante.records.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CadastroRecord(@NotBlank(message = "O nome é obrigatório") String nome, @NotBlank(message = "O email é obrigatório") String email,
                             @NotBlank(message = "A senha é obrigatória") String senha, @NotNull String repita_senha) {
}