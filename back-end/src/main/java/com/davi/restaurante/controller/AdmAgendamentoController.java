package com.davi.restaurante.controller;

import com.davi.restaurante.records.response.AgendamentoResponseRecord;
import com.davi.restaurante.services.AdmAgendamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/adm/agendamento")
@PreAuthorize("hasRole('ADM')")
public class AdmAgendamentoController {
    private final AdmAgendamentoService service;

    public AdmAgendamentoController(AdmAgendamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<AgendamentoResponseRecord>> todosAgendamentos() {
        return ResponseEntity.ok(this.service.todosAgendamentos());
    }

    @PatchMapping("/cancelar/{agendamentoId}")
    public ResponseEntity<AgendamentoResponseRecord> cancelar(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(this.service.cancelar(agendamentoId));
    }

    @PatchMapping("/confirmar/{agendamentoId}")
    public ResponseEntity<AgendamentoResponseRecord> confirmar(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(this.service.confimar(agendamentoId));
    }

    @GetMapping("/buscar/{agendamentoId}")
    public ResponseEntity<AgendamentoResponseRecord> buscarId(@PathVariable Long agendamentoId) {
        return ResponseEntity.ok(this.service.buscaId(agendamentoId));
    }
}
