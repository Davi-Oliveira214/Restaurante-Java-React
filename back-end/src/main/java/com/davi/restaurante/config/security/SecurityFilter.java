package com.davi.restaurante.config.security;

import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenProvider provider;
    private final UsuarioRepository repository;

    public SecurityFilter(TokenProvider provider, UsuarioRepository repository) {
        this.provider = provider;
        this.repository = repository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = this.extractToken(request);

        if (token != null) {

            String emailUser = this.provider.checkToken(token);
            UserDetails user = this.repository.findByEmail(emailUser).orElseThrow(() -> new UsuarioException("Usuário ou senha inválidos", HttpStatus.UNAUTHORIZED));

            var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");

        if (token == null) return null;

        return token.replace("Bearer ", "");
    }
}
