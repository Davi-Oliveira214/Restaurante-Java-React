package com.davi.restaurante.repository;

import com.davi.restaurante.entity.MesaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MesaRepository extends JpaRepository<MesaEntity, Long> {

    @Query(name = "mesa_id")
    Optional<MesaEntity> findByNumero(Long numero);
}
