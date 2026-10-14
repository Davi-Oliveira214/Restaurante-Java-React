package com.davi.restaurante.security;

import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.repository.UsuarioRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsCustom implements UserDetailsService {

    private final UsuarioRepository service;

    public UserDetailsCustom(UsuarioRepository service) {
        this.service = service;
    }

    @Override
    public UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        return this.service.findByEmail(username).orElseThrow(() -> new UsuarioException("Usuário ou senha inválidos encontrado", HttpStatus.UNAUTHORIZED));
    }
}
