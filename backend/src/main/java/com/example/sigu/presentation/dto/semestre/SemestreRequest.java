package com.example.sigu.presentation.dto.semestre;

import com.example.sigu.util.validation.DateRangeValid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

@DateRangeValid(
        fechaInicio = "fechaInicio",
        fechaFin = "fechaFin"
)
public record SemestreRequest(
        @NotBlank(message = "El nombre del semestre es obligatorio")
        String nombre,

        @NotNull(message = "La fecha de inicio es obligatoria")
        LocalDate fechaInicio,

        @NotNull(message = "La fecha de fin es obligatoria")
        LocalDate fechaFin,

        @NotNull(message = "El estado es obligatorio")
        EstadoSemestre estado,

        @Positive(message = "El ID de usuario debe ser un valor positivo")
        @NotNull(message = "El ID del usuario creador es obligatorio")
        Long usuarioId
) {

}
