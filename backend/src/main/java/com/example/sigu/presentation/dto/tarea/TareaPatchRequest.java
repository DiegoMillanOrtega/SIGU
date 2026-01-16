package com.example.sigu.presentation.dto.tarea;

import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.persistence.enums.Prioridad;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record TareaPatchRequest(
        String titulo,
        String descripcion,
        LocalDate fechaEntrega,
        Prioridad prioridad,
        Long materiaId,
        Long archivoId,
        Estado estado
) {
}
