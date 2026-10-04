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

    @Column(unique = true, name = "numero_mesa")
    private Integer numero;

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

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
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
