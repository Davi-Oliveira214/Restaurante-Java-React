package com.davi.restaurante.services;

import com.davi.restaurante.entity.AgendamentoEntity;
import com.davi.restaurante.entity.MesaEntity;
import com.davi.restaurante.entity.UsuarioEntity;
import com.davi.restaurante.exceptions.AgendamentoException;
import com.davi.restaurante.exceptions.RestauranteException;
import com.davi.restaurante.exceptions.UsuarioException;
import com.davi.restaurante.records.request.AgendamentoRecord;
import com.davi.restaurante.records.response.AgendamentoResponseRecord;
import com.davi.restaurante.records.response.HorarioDisponivel;
import com.davi.restaurante.repository.AgendamentoRepository;
import com.davi.restaurante.repository.MesaRepository;
import com.davi.restaurante.repository.UsuarioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class AgendamentoService {
    private final AgendamentoRepository repository;

    private final MesaRepository mesaRepository;

    private final UsuarioRepository userRepository;

    public AgendamentoService(AgendamentoRepository repository, MesaRepository mesaRepository, UsuarioRepository userRepository) {
        this.repository = repository;
        this.mesaRepository = mesaRepository;
        this.userRepository = userRepository;
    }

    public AgendamentoResponseRecord agendar(AgendamentoRecord record) {
        AgendamentoEntity agendamento = new AgendamentoEntity();

        UsuarioEntity user = this.userRepository.findById(record.userId()).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        MesaEntity mesa = this.mesaRepository.findById(record.mesa()).orElseThrow(() -> new RestauranteException("Mesa informada não encontrada", HttpStatus.NOT_FOUND));

        if (this.repository.existeConflitoNoAgendamento(record.data(), calcHoras(record.data(), record.duracao()), mesa.getId(), null))
            throw new AgendamentoException("O tempo de agendamento gera conflito com os demais agendamentos", HttpStatus.CONFLICT);

        BeanUtils.copyProperties(record, agendamento);
        agendamento.setMesa(mesa);
        agendamento.setUsuario(user);

        this.repository.save(agendamento);
        return new AgendamentoResponseRecord(agendamento);
    }

    public AgendamentoResponseRecord cancelarAgendamento(Long userId, Long id) {
        UsuarioEntity user = this.userRepository.findById(userId).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        AgendamentoEntity agendamento = this.repository.findById(id).orElseThrow(() -> new AgendamentoException("Nenhum agendamento encontrado", HttpStatus.NOT_FOUND));

        if (!Objects.equals(user.getId(), agendamento.getUsuario().getId()))
            throw new AgendamentoException("Você não tem autorização para mudar essa agendamneto", HttpStatus.UNAUTHORIZED);

        this.repository.delete(agendamento);

        return new AgendamentoResponseRecord(agendamento);
    }

    public AgendamentoResponseRecord editarAgendamento(Long id, AgendamentoRecord record) {
        UsuarioEntity user = this.userRepository.findById(record.userId()).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        AgendamentoEntity agendamento = this.repository.findById(id)
                .orElseThrow(() -> new AgendamentoException("Nenhum agendamento encontrado", HttpStatus.NOT_FOUND));

        if (!Objects.equals(user.getId(), agendamento.getUsuario().getId()))
            throw new AgendamentoException("Você não tem autorização para mudar essa agendamneto", HttpStatus.UNAUTHORIZED);

        MesaEntity mesa = this.mesaRepository.findById(record.mesa())
                .orElseThrow(() -> new AgendamentoException("Mesa informada não encontrada", HttpStatus.NOT_FOUND));

        if (this.repository.existeConflitoNoAgendamento(record.data(), calcHoras(record.data(), record.duracao()), mesa.getId(), agendamento.getId()))
            throw new AgendamentoException("O tempo de agendamento gera conflito com os demais agendamentos", HttpStatus.CONFLICT);

        agendamento.setData(record.data());
        agendamento.setDuracao(record.duracao());
        agendamento.setMesa(mesa);

        return new AgendamentoResponseRecord(this.repository.save(agendamento));
    }

    public List<AgendamentoResponseRecord> todosAgendamentos() {
        List<AgendamentoEntity> agendamentos = this.repository.findAll();

        if (agendamentos.isEmpty())
            throw new AgendamentoException("Nenhum agendamento encontrado", HttpStatus.NOT_FOUND);

        return agendamentos.stream().map(AgendamentoResponseRecord::new).toList();
    }

    public List<AgendamentoResponseRecord> usuarioTodosAgendamentos(Long id) {
        UsuarioEntity user = this.userRepository.findById(id).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        List<AgendamentoEntity> agendamentos = this.repository.findByUsuarioId(user.getId());

        if (agendamentos.isEmpty())
            throw new AgendamentoException("Nenhum Agendamento encontrado", HttpStatus.NOT_FOUND);

        return agendamentos.stream().map(AgendamentoResponseRecord::new).toList();
    }

    public AgendamentoResponseRecord agendamentoId(Long user_id, Long agendamento_id) {
        UsuarioEntity user = this.userRepository.findById(user_id).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        AgendamentoEntity agendamento = this.repository.findById(agendamento_id).orElseThrow(() -> new AgendamentoException("Nenhum agendamento encontrado", HttpStatus.NOT_FOUND));

        if (!Objects.equals(user.getId(), agendamento.getUsuario().getId()))
            throw new AgendamentoException("Você não tem autorização para mudar essa agendamneto", HttpStatus.UNAUTHORIZED);

        return new AgendamentoResponseRecord(agendamento);
    }

    public List<AgendamentoResponseRecord> agendamentoDoDia(Long userId, LocalDate data, Long mesaId) {
        this.userRepository.findById(userId).orElseThrow(() -> new UsuarioException("Usuário não encontrado", HttpStatus.NOT_FOUND));

        LocalDateTime inicio = data.atStartOfDay();
        LocalDateTime fim = data.atTime(LocalTime.MAX);

        MesaEntity mesa = this.mesaRepository.findById(mesaId).orElseThrow(() -> new RestauranteException("Mesa informada não encontrada", HttpStatus.NOT_FOUND));

        List<AgendamentoEntity> agendamentos = this.repository.findAgendamentosDoDia(inicio, fim, mesa.getId(), userId);

        if (agendamentos.isEmpty())
            throw new AgendamentoException("Nenhum agendamento na data " + data + " para a mesa: " + mesaId, HttpStatus.NOT_FOUND);

        return agendamentos.stream().map(AgendamentoResponseRecord::new).toList();
    }

    public List<HorarioDisponivel> horariosDisponiveis(LocalDate data, Long mesa, int duracao) {
        LocalDateTime inicio = data.atStartOfDay().plusHours(8);
        LocalDateTime fim = data.atStartOfDay().plusHours(22);

        List<AgendamentoEntity> agenda = repository.findAgendamentoDia(inicio, fim, mesa);

        List<HorarioDisponivel> horariosDisponiveis = new ArrayList<>();

        LocalDateTime ultimo = beforeHours(agenda, duracao, horariosDisponiveis, inicio);

        afterHours(fim, horariosDisponiveis, duracao, ultimo);

        return horariosDisponiveis;
    }

    private LocalDateTime beforeHours(List<AgendamentoEntity> agenda, int duracao, List<HorarioDisponivel> list, LocalDateTime inicio) {
        for (AgendamentoEntity a : agenda) {
            LocalDateTime inicioAgenda = a.getData();
            LocalDateTime fimAgenda = calcHoras(inicioAgenda, a.getDuracao());

            while (!calcHoras(inicio, duracao).isAfter(inicioAgenda)) {
                LocalDateTime novoFim = calcHoras(inicio, duracao);

                list.add(new HorarioDisponivel(inicio, novoFim));

                inicio = novoFim;
            }

            if (fimAgenda.isAfter(inicio)) {
                inicio = fimAgenda;
            }
        }

        return inicio;
    }

    private void afterHours(LocalDateTime fim, List<HorarioDisponivel> list, int duracao, LocalDateTime ultimo) {
        while (!ultimo.plusMinutes(duracao).isAfter(fim)) {
            LocalDateTime novoFim = calcHoras(ultimo, duracao);

            list.add(new HorarioDisponivel(ultimo, novoFim));

            ultimo = novoFim;
        }
    }

    private LocalDateTime calcHoras(LocalDateTime data, int duracao) {
        final int intervalo = 15;
        return data.plusMinutes(duracao + intervalo);
    }
}