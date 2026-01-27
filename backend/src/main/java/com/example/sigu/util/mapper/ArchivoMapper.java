package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Archivo;
import com.example.sigu.presentation.dto.archivo.ArchivoGoogleDriveRequest;
import com.example.sigu.presentation.dto.archivo.ArchivoRequest;
import com.example.sigu.presentation.dto.archivo.ArchivoResponse;
import com.google.api.services.drive.model.File;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
        componentModel = "spring",
        uses = { MateriaMapper.class },
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ArchivoMapper {

    @Mapping(target = "materia", ignore = true)
    Archivo toEntity(ArchivoRequest request);

    @Mapping(target = "materiaId", source = "archivo.materia.id")
    @Mapping(target = "materiaNombre", source = "archivo.materia.nombre")
    ArchivoResponse toResponse(Archivo archivo);

    @Mapping(target = "googleDriveFileId", source = "file.id")
    @Mapping(target = "tamano", source = "file.size")
    @Mapping(target = "mimeType", source = "file.mimeType")
    @Mapping(target = "googleDriveWebViewLink", source = "file.webViewLink")
    @Mapping(target = "id", ignore = true)
    void updateEntityFromFile(File file, @MappingTarget Archivo entity);
}
