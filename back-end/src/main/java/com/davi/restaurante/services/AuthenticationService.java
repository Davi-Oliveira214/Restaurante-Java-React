package com.davi.restaurante.services;

import com.davi.restaurante.entity.UsuarioEntity;
import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.records.request.CreateRequest;
import com.davi.restaurante.records.request.LoginRequest;
import com.davi.restaurante.records.response.LoginResponse;
import com.davi.restaurante.repository.UsuarioRepository;
import com.davi.restaurante.security.TokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class AuthenticationService {

    private final UsuarioRepository repository;
    private final AuthenticationManager manager;
    private final TokenProvider provider;

    // Máxima de Tentativas
    private final int MAX_TENTATIVAS = 5;

    public AuthenticationService(UsuarioRepository repository, AuthenticationManager manager, TokenProvider provider) {
        this.repository = repository;
        this.manager = manager;
        this.provider = provider;
    }

    public void register(CreateRequest record) {
        if (this.repository.existsByEmail(record.email()))
            throw new UsuarioException("Esse usuário já está cadastrado", HttpStatus.UNAUTHORIZED);

        verificarCaracterSenha(record.password(), record.repita_password());
        String passwordEncode = new BCryptPasswordEncoder().encode(record.password());
        UsuarioEntity usuario = new UsuarioEntity(record, passwordEncode);

        this.repository.save(usuario);
    }

    public LoginResponse login(LoginRequest record) {
        var user = this.repository.findByEmail(record.email()).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        if (!user.isAccountNonLocked()) {
            Instant hora = Instant.now();

            if (user.getTempoBloqueio() != null && user.getTempoBloqueio().isBefore(hora)) {
                this.setBloqueio(user, 0, null, true);
            }

            if (user.getTentativas() >= MAX_TENTATIVAS) {
                Duration tempo = Duration.between(hora, user.getTempoBloqueio());
                throw new UsuarioException("Máximo de tentativas excedidas. Tempo restante de bloqueio: " + tempo.toMinutes(), HttpStatus.UNAUTHORIZED);
            }
        }

        try {
            var token = new UsernamePasswordAuthenticationToken(record.email(), record.password());
            var auth = this.manager.authenticate(token);

            return new LoginResponse(this.provider.generationToken(auth.getName()));
        } catch (BadCredentialsException badCredentials) {
            int tentativas = user.getTentativas() + 1;
            user.setTentativas(tentativas);

            if (tentativas >= MAX_TENTATIVAS) {
                this.setBloqueio(user, MAX_TENTATIVAS, this.setTempoBloqueio(), false);
            } else {
                this.setBloqueio(user, tentativas, user.getTempoBloqueio(), true);
            }

            throw new UsuarioException("Email ou senha inválidos. Tentativas feitas: " + tentativas, HttpStatus.UNAUTHORIZED);
        }
    }

    private void verificarCaracterSenha(String senha, String rpt_senha) {
        boolean maiuscula = false, minuscula = false, numeros = false, simbolos = false;

        if (senha.length() < 5)
            throw new UsuarioException("A senha precisa ter no minímo 5 caracteres", HttpStatus.CONFLICT);

        for (Character c : senha.toCharArray()) {
            if (Character.isLowerCase(c)) minuscula = true;
            if (Character.isUpperCase(c)) maiuscula = true;
            if (Character.isDigit(c)) numeros = true;
            if (!Character.isWhitespace(c)) simbolos = true;
        }

        if (!minuscula || !maiuscula || !numeros || !simbolos)
            throw new UsuarioException("A senha precisa ter letras maiúsculas, minúsculas e símbolos", HttpStatus.CONFLICT);

        if (!senha.equals(rpt_senha))
            throw new UsuarioException("Repita a mesma senha", HttpStatus.CONFLICT);
    }

    private void setBloqueio(UsuarioEntity user, int tentativas, Instant bloqueio, boolean locked) {
        user.setTentativas(tentativas);
        user.setTempoBloqueio(bloqueio);
        user.setAccountNonLocked(locked);
        this.repository.save(user);
    }

    private Instant setTempoBloqueio() {
        final long BLOQUEIO = 16;
        return Instant.now().plus(BLOQUEIO, ChronoUnit.MINUTES);
    }
}