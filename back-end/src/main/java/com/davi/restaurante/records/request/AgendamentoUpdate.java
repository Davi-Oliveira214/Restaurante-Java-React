package com.davi.restaurante.records.request;

import java.time.LocalDateTime;

public record AgendamentoUpdate(LocalDateTime data, Integer duracao, Long mesa, String status) {
}
