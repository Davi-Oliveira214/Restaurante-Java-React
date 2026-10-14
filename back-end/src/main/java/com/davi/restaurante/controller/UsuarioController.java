package com.davi.restaurante.controller;

import com.davi.restaurante.records.request.UsuarioUpdate;
import com.davi.restaurante.records.response.UsuarioResponse;
import com.davi.restaurante.services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {
    @Autowired
    private UsuarioService service;

    @GetMapping
    public ResponseEntity<UsuarioResponse> usuario() {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.usuario());
    }

    @PutMapping
    public ResponseEntity<UsuarioResponse> update(@RequestBody UsuarioUpdate update) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.update(update));
    }

    @DeleteMapping
    public ResponseEntity<?> delete() {
        this.service.delete();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}