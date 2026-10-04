package com.davi.restaurante.services;

import com.davi.restaurante.entity.MesaEntity;
import com.davi.restaurante.exceptions.MesaException;
import com.davi.restaurante.records.request.MesaRecord;
import com.davi.restaurante.records.response.MesaResponseRecord;
import com.davi.restaurante.repository.AgendamentoRepository;
import com.davi.restaurante.repository.MesaRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MesaService {
    private final MesaRepository repository;

    private final AgendamentoRepository agendamentoRepository;

    public MesaService(MesaRepository repository, AgendamentoRepository agendamentoRepository) {
        this.repository = repository;
        this.agendamentoRepository = agendamentoRepository;
    }

    public List<MesaResponseRecord> allDesk() {
        return this.repository.findAll().stream().map(MesaResponseRecord::new).toList();
    }

    public MesaResponseRecord createDesk(MesaRecord record) {
        if (this.repository.existsByCodigo(record.codigo()))
            throw new MesaException("Esse código de mesa já existe", HttpStatus.CONFLICT);

        MesaEntity mesa = new MesaEntity();
        BeanUtils.copyProperties(record, mesa);

        return new MesaResponseRecord(this.repository.save(mesa));
    }

    public MesaResponseRecord deleteDesk(Long id) {
        MesaEntity mesa = this.repository.findById(id).orElseThrow(MesaException::new);

        if (this.agendamentoRepository.existsMesa(id))
            throw new MesaException("Não é possivél apagar uma mesa com agendamentos", HttpStatus.CONFLICT);

        this.repository.delete(mesa);
        return new MesaResponseRecord(mesa);
    }

    public MesaResponseRecord updateDesk(Long id, MesaRecord record) {
        if (this.repository.existsByCodigo(record.codigo()))
            throw new MesaException("Esse código de mesa já existe", HttpStatus.CONFLICT);

        MesaEntity mesa = this.repository.findById(id).orElseThrow(MesaException::new);
        mesa.setCodigo(record.codigo());

        return new MesaResponseRecord(this.repository.save(mesa));
    }
}
