package com.davi.restaurante.controller;

import com.davi.restaurante.records.request.AgendamentoRecord;
import com.davi.restaurante.records.response.AgendamentoResponseRecord;
import com.davi.restaurante.records.response.HorarioDisponivel;
import com.davi.restaurante.services.AgendamentoService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/agendamento")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AgendamentoResponseRecord> agendar(@RequestBody @Valid AgendamentoRecord agendamento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.agendar(agendamento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AgendamentoResponseRecord> editar(@PathVariable Long id, @RequestBody @Valid AgendamentoRecord agendamento) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.editarAgendamento(id, agendamento));
    }

    @DeleteMapping("/{userId}/{id}")
    public ResponseEntity<AgendamentoResponseRecord> cancelar(@PathVariable Long userId, @PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.cancelarAgendamento(userId, id));
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseRecord>> todosAgendamentos() {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.todosAgendamentos());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<AgendamentoResponseRecord>> usuarioTodosAgendamentos(@PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.usuarioTodosAgendamentos(userId));
    }

    @GetMapping("/{user}/{id}")
    public ResponseEntity<AgendamentoResponseRecord> agendamentoId(@PathVariable Long user, @PathVariable("id") Long agendamento_id) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.agendamentoId(user, agendamento_id));
    }

    @GetMapping("/{userId}/data/{numero_mesa}")
    public ResponseEntity<List<AgendamentoResponseRecord>> agendamentoDoDia(@PathVariable Long userId, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data, @PathVariable("mesa_id") Long mesa) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.agendamentoDoDia(userId, data, mesa));
    }

    @GetMapping("/{mesa_id}/horarios")
    public ResponseEntity<List<HorarioDisponivel>> agendamentoDoDia(@PathVariable("mesa_id") Long mesa, @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data, @RequestParam("duracao") int time) {
        return ResponseEntity.status(HttpStatus.OK).body(this.service.horariosDisponiveis(data, mesa, time));
    }
}