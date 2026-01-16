package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.presentation.dto.tarea.TareaRequest;
import com.example.sigu.presentation.dto.tarea.TareaResponse;
import com.example.sigu.presentation.dto.tarea.TareaPatchRequest;
import org.mapstruct.*;

@Mapper(
        componentModel = "spring",
        uses = { MateriaMapper.class, ArchivoMapper.class },
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface TareaMapper {

    @Mapping(target = "materia", ignore = true)
    @Mapping(target = "archivo", ignore = true)
    Tarea toEntity(TareaRequest request);

    @Mapping(target = "materia", ignore = true)
    @Mapping(target = "archivo", ignore = true)
    void updateEntityFromPatch(TareaPatchRequest request, @MappingTarget Tarea entity);

    @Mapping(target = "materiaId", source = "materia.id")
    @Mapping(target = "materiaNombre", source = "materia.nombre")
    @Mapping(target = "semestreId", source = "materia.semestre.id")
    @Mapping(target = "semestreNombre", source = "materia.semestre.nombre")
    @Mapping(target = "archivoId", source = "archivo.id")
    @Mapping(target = "archivoNombre", source = "archivo.nombre")
    @Mapping(target = "archivoView", source = "archivo.googleDriveWebViewLink")
    TareaResponse toResponse(Tarea tarea);

    TareaPatchRequest toPatchRequest(Tarea tarea);

}
