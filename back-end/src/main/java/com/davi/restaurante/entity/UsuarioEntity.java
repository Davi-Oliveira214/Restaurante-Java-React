package com.davi.restaurante.entity;

import com.davi.restaurante.entity.Enums.UsuarioRole;
import com.davi.restaurante.records.request.CreateRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "usuario")
@DynamicInsert
public class UsuarioEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "tentativas_login")
    private int tentativas = 0;

    @Column(name = "tempo_bloqueio")
    private Instant tempoBloqueio;

    @Column(name = "account_non_locked")
    private boolean accountNonLocked = true;

    @OneToMany(mappedBy = "usuario")
    private Set<AgendamentoEntity> agendamentos = new HashSet<>();

    @Column(name = "permissao", nullable = false, columnDefinition = "int DEFAULT 1")
    private UsuarioRole role;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criado;

    public UsuarioEntity() {
    }

    public UsuarioEntity(CreateRequest request, String password) {
        this.nome = request.nome();
        this.email = request.email();
        this.password = password;
        this.role = UsuarioRole.USER;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public int getTentativas() {
        return tentativas;
    }

    public void setTentativas(int tentativas) {
        this.tentativas = tentativas;
    }

    public Instant getTempoBloqueio() {
        return tempoBloqueio;
    }

    public void setTempoBloqueio(Instant tempoBloqueio) {
        this.tempoBloqueio = tempoBloqueio;
    }

    public Set<AgendamentoEntity> getAgendamentos() {
        return agendamentos;
    }

    public void setAgendamentos(Set<AgendamentoEntity> agendamentos) {
        this.agendamentos = agendamentos;
    }

    public UsuarioRole getRole() {
        return role;
    }

    public void setRole(UsuarioRole role) {
        this.role = role;
    }

    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    public void setAccountNonLocked(boolean accountNonLocked) {
        this.accountNonLocked = accountNonLocked;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this.role == UsuarioRole.ADM)
            return List.of(new SimpleGrantedAuthority("ROLE_ADM"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public @NotNull String getUsername() {
        return this.email;
    }
}
