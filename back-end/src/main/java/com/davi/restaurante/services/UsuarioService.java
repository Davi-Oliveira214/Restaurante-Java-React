package com.davi.restaurante.services;

import com.davi.restaurante.entity.UsuarioEntity;
import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.records.request.CadastroRecord;
import com.davi.restaurante.records.request.LoginRecord;
import com.davi.restaurante.records.response.AuthRecord;
import com.davi.restaurante.records.response.UsuarioResponseRecord;
import com.davi.restaurante.repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.HexFormat;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository repository;

    // Máxima de Tentativas
    private final int MAX_TENTATIVAS = 5;

    public UsuarioService() {
    }

    public AuthRecord cadastrar(CadastroRecord record) {
        UsuarioEntity user = new UsuarioEntity();

        if (this.repository.existsByEmail(record.email()))
            throw new UsuarioException("Esse email já está cadastrado", HttpStatus.CONFLICT);

        verificarCaracterSenha(record.senha(), record.repita_senha());

        BeanUtils.copyProperties(record, user);

        user.setSenha(this.hashPassWord(record.senha()));

        return new AuthRecord(this.repository.save(user));
    }

    public AuthRecord login(LoginRecord record) {
        UsuarioEntity user = this.repository.findByEmail(record.email()).orElseThrow(() -> new UsuarioException("Nenhum usuário encontrado", HttpStatus.UNAUTHORIZED));

        Instant hora = Instant.now();

        if (user.getBloqueio() != null && hora.isAfter(user.getBloqueio())) {
            this.setBloqueio(user, 0, null);
        }

        if (user.getTentativas() >= MAX_TENTATIVAS) {
            if (user.getBloqueio() == null) {
                this.setBloqueio(user, MAX_TENTATIVAS, this.setTempoBloqueio());
            }

            Duration tempo = Duration.between(hora, user.getBloqueio());

            throw new UsuarioException("Máximo de tentativas excedidas. Tempo restante de bloqueio: " + tempo.toMinutes(), HttpStatus.UNAUTHORIZED);
        }

        String pass = hashPassWord(record.senha());
        if (!user.getSenha().equals(pass)) {
            int tentativas = user.getTentativas() + 1;

            if (tentativas >= MAX_TENTATIVAS) {
                this.setBloqueio(user, MAX_TENTATIVAS, this.setTempoBloqueio());
            } else {
                this.setBloqueio(user, tentativas, user.getBloqueio());
            }

            throw new UsuarioException("Email ou senha inválidos. Tentativas feitas: " + tentativas, HttpStatus.UNAUTHORIZED);
        }

        this.setBloqueio(user, 0, null);
        return new AuthRecord(user);
    }

    public UsuarioResponseRecord usuario(Long id) {
        UsuarioEntity user = this.repository.findById(id).orElseThrow(() -> new UsuarioException("Erro ao verificar usuário", HttpStatus.NOT_FOUND));

        return new UsuarioResponseRecord(user);
    }

    public UsuarioResponseRecord deletar(Long id) {
        UsuarioEntity user = this.repository.findById(id).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        this.repository.delete(user);
        return new UsuarioResponseRecord(user);
    }

    private String hashPassWord(String senha) {
        MessageDigest passHash;

        try {
            passHash = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new UsuarioException("Erro ao criptografar senha", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return HexFormat.of().formatHex(passHash.digest(senha.getBytes(StandardCharsets.UTF_8)));
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

        if (!minuscula || !maiuscula || !numeros || !simbolos) {
            throw new UsuarioException("A senha precisa ter letras maiúsculas, minúsculas e símbolos", HttpStatus.CONFLICT);
        }

        if (!senha.equals(rpt_senha))
            throw new UsuarioException("Repita a mesma senha", HttpStatus.CONFLICT);
    }

    private void setBloqueio(UsuarioEntity user, int tentativas, Instant bloqueio) {
        user.setTentativas(tentativas);
        user.setBloqueio(bloqueio);
        this.repository.save(user);
    }

    private Instant setTempoBloqueio() {
        final long BLOQUEIO = 16;
        return Instant.now().plus(BLOQUEIO, ChronoUnit.MINUTES);
    }
}