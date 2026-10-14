package com.davi.restaurante.controller;

import com.davi.restaurante.records.request.CreateRequest;
import com.davi.restaurante.records.request.LoginRequest;
import com.davi.restaurante.records.response.LoginResponse;
import com.davi.restaurante.services.AuthenticationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final AuthenticationService service;

    public AuthenticationController(AuthenticationService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest login) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.login(login));
    }

    @PostMapping("/register")
    public ResponseEntity<?> create(@RequestBody CreateRequest create) {
        this.service.register(create);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
