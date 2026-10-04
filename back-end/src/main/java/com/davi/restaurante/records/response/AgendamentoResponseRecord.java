package com.davi.restaurante.records.response;


import com.davi.restaurante.entity.AgendamentoEntity;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record AgendamentoResponseRecord(Long userId, Long agendamentoId, LocalDateTime data, int duracao,
                                        @JsonProperty("mesa") MesaResponseRecord mesa) {
    public AgendamentoResponseRecord(AgendamentoEntity a) {
        this(a.getUsuario().getId(), a.getId(), a.getData(), a.getDuracao(), new MesaResponseRecord(a.getMesa().getId(), a.getMesa().getCodigo(), a.getMesa().getCriado()));
    }
}