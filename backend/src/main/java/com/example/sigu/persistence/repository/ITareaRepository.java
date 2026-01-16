package com.example.sigu.persistence.repository;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.presentation.dto.tarea.TareaStasts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface ITareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findAllByMateria_Semestre_UsuarioId(Long usuarioId);
    Optional<Tarea> findByIdAndMateria_Semestre_UsuarioId(Long id, Long usuarioId);

    @Query("SELECT t FROM Tarea t " +
            "JOIN FETCH t.materia m " +
            "JOIN FETCH m.semestre s " +
            "LEFT JOIN FETCH t.archivo a " +
            "WHERE s.usuario.id = :usuarioId " +
            "AND s.estado = 'ACTIVO' " +
            "AND (:materiaId IS NULL OR m.id = :materiaId) " +
            "AND (" +
            "    :tareaEstado IS NULL OR " +
            "    (:tareaEstado = 'COMPLETADA' AND t.estado = 'COMPLETADA') OR " +
            "    (:tareaEstado = 'PENDIENTE' AND t.estado = 'PENDIENTE') OR " +
            "    (:tareaEstado = 'ATRASADA' AND t.estado = 'PENDIENTE' AND t.fechaEntrega < CURRENT_DATE) OR " +
            "    (:tareaEstado = 'HOY' AND t.estado = 'PENDIENTE' AND t.fechaEntrega = CURRENT_DATE))"
            )
    List<Tarea> findAll(
            @Param("usuarioId") Long usuarioId,
            @Param("tareaEstado") String tareaEstado, // Cambiado a String para manejar 'ATRASADA'
            @Param("materiaId") Long materiaId
    );


    @Query("SELECT new com.example.sigu.presentation.dto.tarea.TareaStasts(" +
            "COUNT(t), " +
            "SUM(CASE WHEN t.estado != 'COMPLETADA' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN t.estado = 'COMPLETADA' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN t.estado != 'COMPLETADA' AND t.fechaEntrega < CURRENT_DATE THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN t.estado != 'COMPLETADA' AND t.fechaEntrega = CURRENT_DATE THEN 1 ELSE 0 END)) " +
            "FROM Tarea t")
    TareaStasts getGlobalStats();
}
