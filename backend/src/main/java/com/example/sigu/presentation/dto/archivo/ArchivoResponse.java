package com.example.sigu.presentation.dto.archivo;

import com.example.sigu.persistence.enums.TipoArchivo;
import com.example.sigu.presentation.dto.materia.MateriaResponse;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record ArchivoResponse(
        Long id,
        String nombre,
        String mimeType,
        Long tamano,
        String googleDriveFileId,
        String materiaFolderId,
        String semestreFolderId,
        String googleDriveWebViewLink,
        String descripcion,
        LocalDate fechaModificacion,
        Long materiaId,
        String materiaNombre
) {
}
