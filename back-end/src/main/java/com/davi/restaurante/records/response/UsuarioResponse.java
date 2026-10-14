package com.davi.restaurante.records.response;

import com.davi.restaurante.entity.UsuarioEntity;

import java.time.Instant;

public record UsuarioResponse(String nome, String email, String role, Instant criado_em) {
    public UsuarioResponse(UsuarioEntity user) {
        this(user.getNome(), user.getEmail(), user.getRole().getNome(), user.getCriado());
    }
}
