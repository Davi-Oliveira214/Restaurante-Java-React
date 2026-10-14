package com.davi.restaurante.services;

import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.records.request.UsuarioUpdate;
import com.davi.restaurante.records.response.UsuarioResponse;
import com.davi.restaurante.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public UsuarioResponse usuario() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null)
            throw new UsuarioException("Usuário não autenticado", HttpStatus.UNAUTHORIZED);

        var user = this.repository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsuarioException("Erro ao buscar dados de usuário", HttpStatus.BAD_REQUEST));

        return new UsuarioResponse(user);
    }

    public UsuarioResponse update(UsuarioUpdate record) {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null)
            throw new UsuarioException("Usuário não autenticado", HttpStatus.UNAUTHORIZED);

        var user = this.repository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsuarioException("Erro ao buscar dados de usuário", HttpStatus.BAD_REQUEST));

        if (record.nome() != null && !record.nome().isBlank())
            user.setNome(record.nome());

        if (record.email() != null && !record.email().isBlank())
            user.setEmail(record.email());

        return new UsuarioResponse(this.repository.save(user));
    }

    public void delete() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null)
            throw new UsuarioException("Usuário não autenticado", HttpStatus.UNAUTHORIZED);

        var user = this.repository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsuarioException("Erro ao buscar dados de usuário", HttpStatus.BAD_REQUEST));

        this.repository.delete(user);
    }
}
