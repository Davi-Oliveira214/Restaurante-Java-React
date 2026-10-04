package com.davi.restaurante.controller;

import com.davi.restaurante.records.request.MesaRecord;
import com.davi.restaurante.records.response.MesaResponseRecord;
import com.davi.restaurante.services.MesaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesa")
public class MesaController {
    private final MesaService service;

    public MesaController(MesaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<MesaResponseRecord>> allDesk() {
        return ResponseEntity.ok(this.service.allDesk());
    }

    @PostMapping
    public ResponseEntity<MesaResponseRecord> createDesk(@RequestBody MesaRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.service.createDesk(record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MesaResponseRecord> deleteDesk(@PathVariable Long id) {
        return ResponseEntity.ok(this.service.deleteDesk(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MesaResponseRecord> updateDesk(@PathVariable("id") Long mesa_id, @RequestBody MesaRecord record) {
        return ResponseEntity.ok(this.service.updateDesk(mesa_id, record));
    }
}
