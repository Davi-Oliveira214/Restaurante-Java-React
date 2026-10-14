package com.davi.restaurante.entity.Enums;

public enum UsuarioRole {
    ADM("adm"),
    USER("user");

    private final String nome;

    UsuarioRole(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }
}
