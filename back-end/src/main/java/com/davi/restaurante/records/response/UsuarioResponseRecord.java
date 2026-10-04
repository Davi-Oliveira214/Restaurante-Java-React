package com.davi.restaurante.records.response;

import com.davi.restaurante.entity.UsuarioEntity;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public record UsuarioResponseRecord(Long id, String nome, String email, @JsonProperty("criado_em") Instant criado) {
    public UsuarioResponseRecord(UsuarioEntity user) {
        this(user.getId(), user.getNome(), user.getEmail(), user.getCriado());
    }
}
