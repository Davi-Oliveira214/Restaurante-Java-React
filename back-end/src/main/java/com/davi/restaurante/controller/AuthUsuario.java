package com.davi.restaurante.controller;

import com.davi.restaurante.records.request.CadastroRecord;
import com.davi.restaurante.records.request.LoginRecord;
import com.davi.restaurante.records.response.AuthRecord;
import com.davi.restaurante.records.response.UsuarioResponseRecord;
import com.davi.restaurante.services.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthUsuario {
    @Autowired
    private UsuarioService service;

    @PostMapping("/cadastro")
    public ResponseEntity<AuthRecord> cadastro(@RequestBody @Valid CadastroRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.cadastrar(record));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthRecord> login(@RequestBody @Valid LoginRecord record) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.login(record));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseRecord> usuario(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.usuario(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<UsuarioResponseRecord> deletarUsuario(@PathVariable Long id){
        return ResponseEntity.status(200).body(this.service.deletar(id));
    }
}