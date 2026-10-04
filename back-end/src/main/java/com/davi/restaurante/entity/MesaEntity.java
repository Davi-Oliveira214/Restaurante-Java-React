package com.davi.restaurante.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "mesa")
public class MesaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, name = "codigo_mesa", nullable = false)
    private String codigo;

    @Column(name = "criado_em", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant criado;

    public MesaEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @PrePersist
    private void onCreate() {
        this.criado = Instant.now();
    }

    public Instant getCriado() {
        return criado;
    }

    public void setCriado(Instant criado) {
        this.criado = criado;
    }
}
