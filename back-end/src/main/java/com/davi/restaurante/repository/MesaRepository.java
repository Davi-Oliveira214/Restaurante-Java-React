package com.davi.restaurante.repository;

import com.davi.restaurante.entity.MesaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MesaRepository extends JpaRepository<MesaEntity, Long> {

    @Query(name = "codigo_mesa")
    boolean existsByCodigo(String codigo);
}
