package com.davi.restaurante.services;

import com.davi.restaurante.entity.AgendamentoEntity;
import com.davi.restaurante.entity.Enums.StatusAgendamento;
import com.davi.restaurante.exceptions.AgendamentoException;
import com.davi.restaurante.records.response.AgendamentoResponseRecord;
import com.davi.restaurante.repository.AgendamentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdmAgendamentoService {
    private final AgendamentoRepository repository;

    public AdmAgendamentoService(AgendamentoRepository repository) {
        this.repository = repository;
    }

    public List<AgendamentoResponseRecord> todosAgendamentos() {
        List<AgendamentoEntity> agendamentos = this.repository.findAll();

        return agendamentos.stream().map(AgendamentoResponseRecord::new).toList();
    }

    public AgendamentoResponseRecord cancelar(Long agendamentoId) {
        AgendamentoEntity agendamento = this.buscar(agendamentoId);

        if (agendamento.getData().isBefore(LocalDateTime.now()))
            throw new AgendamentoException("Não é possível cancelar um agendamento passado", HttpStatus.CONFLICT);

        if (agendamento.getStatus() != StatusAgendamento.AGUARDANDO && agendamento.getStatus() == StatusAgendamento.CANCELADO)
            throw new AgendamentoException("Este agendamento já está cancelado", HttpStatus.CONFLICT);

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        return new AgendamentoResponseRecord(this.repository.save(agendamento));
    }

    public AgendamentoResponseRecord confimar(Long agendamentoId) {
        AgendamentoEntity agendamento = this.buscar(agendamentoId);

        if (agendamento.getData().isBefore(LocalDateTime.now()))
            throw new AgendamentoException("Não é possível confirmar um agendamento passado", HttpStatus.CONFLICT);

        if (agendamento.getStatus() != StatusAgendamento.AGUARDANDO)
            throw new AgendamentoException("Somente agendamentos aguardando podem ser confirmados", HttpStatus.CONFLICT);

        agendamento.setStatus(StatusAgendamento.CONFIRMADO);
        return new AgendamentoResponseRecord(this.repository.save(agendamento));
    }

    public AgendamentoResponseRecord buscaId(Long agendamentoId) {
        return new AgendamentoResponseRecord(buscar(agendamentoId));
    }

    private AgendamentoEntity buscar(Long id) {
        return this.repository.findById(id)
                .orElseThrow(() -> new AgendamentoException("Erro ao buscar agendamento", HttpStatus.NOT_FOUND));
    }
}