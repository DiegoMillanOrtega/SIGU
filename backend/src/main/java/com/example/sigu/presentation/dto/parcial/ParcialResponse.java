package com.example.sigu.presentation.dto.parcial;


import com.example.sigu.persistence.enums.ParcialEstado;
import com.example.sigu.persistence.enums.Prioridad;
import com.example.sigu.persistence.enums.TipoEvaluacion;
import com.example.sigu.presentation.dto.materia.MateriaResponse;

import java.time.LocalDate;
import java.time.LocalTime;

public record ParcialResponse(
        Long id,
        TipoEvaluacion tipo,
        LocalDate fecha,
        LocalTime hora,
        String lugar,
        String temaEvaluar,
        String notaAdicional,
        ParcialEstado estado,
        Long materiaId,
        String materiaNombre,
        Prioridad prioridad
) {
}
