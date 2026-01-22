package com.example.sigu.presentation.dto.parcial;

import com.example.sigu.persistence.enums.ParcialEstado;
import com.example.sigu.persistence.enums.Prioridad;
import com.example.sigu.persistence.enums.TipoEvaluacion;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ParcialRequest(
        @NotNull(message = "El tipo de evaluacion es obligatorio")
        TipoEvaluacion tipo,

        @FutureOrPresent(message = "La fecha del parcial debe ser de hoy o posterior a la fecha actual")
        @NotNull(message = "La fecha del parcial es obligatoria")
        LocalDate fecha,

        @NotNull(message = "La hora del parcial es obligatoria")
        LocalTime hora,

        String lugar,
        String temaEvaluar,
        String notaAdicional,

        ParcialEstado estado,

        @NotNull(message = "El parcial debe estar asociado a una materia")
        Long materiaId,

        @NotNull(message = "La prioridad del parcial es obligatoria")
        Prioridad prioridad
) {
}
