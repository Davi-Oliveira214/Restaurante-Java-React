package com.davi.restaurante.records.response;

import java.time.LocalDateTime;

public record HorarioDisponivel(LocalDateTime inicio,
                                LocalDateTime fim) {
}
