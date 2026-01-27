package com.example.sigu.persistence.repository;

import com.example.sigu.persistence.entity.Parcial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IParcialRepository extends JpaRepository<Parcial, Long> {
    List<Parcial> findAllByMateria_Semestre_UsuarioId(Long usuarioID);
    Optional<Parcial> findByIdAndMateria_Semestre_UsuarioId(Long id, Long usuarioID);

    @Query("SELECT p FROM Parcial p JOIN p.materia m JOIN m.semestre s WHERE s.estado = 'ACTIVO'")
    List<Parcial> findAllBySemestreActivo();

}
