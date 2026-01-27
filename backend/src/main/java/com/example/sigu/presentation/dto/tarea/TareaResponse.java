package com.example.sigu.presentation.dto.tarea;

import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.persistence.enums.Prioridad;
import com.example.sigu.presentation.dto.archivo.ArchivoResponse;
import com.example.sigu.presentation.dto.materia.MateriaResponse;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record TareaResponse(
        Long id,
        String titulo,
        String descripcion,
        LocalDate fechaEntrega,
        Prioridad prioridad,
        Long materiaId,
        String materiaNombre,
        Long semestreId,
        String semestreNombre,
        Long archivoId,
        String archivoNombre,
        String archivoView,
        Estado estado
) {
}
