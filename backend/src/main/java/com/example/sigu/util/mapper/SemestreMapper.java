package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Semestre;
import com.example.sigu.persistence.entity.Usuario;
import com.example.sigu.presentation.dto.semestre.SemestreRequest;
import com.example.sigu.presentation.dto.semestre.SemestreResponse;
import com.example.sigu.service.exception.UsuarioNotFoundException;
import com.example.sigu.service.interfaces.IUsuarioService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.*;
import org.springframework.stereotype.Service;

@Mapper(
        componentModel = "spring",
        uses = { UsuarioMapper.class },
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SemestreMapper {

    @Mapping(target = "usuario", ignore = true)
    Semestre toEntity(SemestreRequest request);


    @Mapping(target = "usuario", ignore = true)
    @Mapping(target = "materias", ignore = true)
    void patchEntity(SemestreRequest request, @MappingTarget Semestre semestre);

    @Mapping(target = "progreso", expression = "java(entity.getProgreso())")
    SemestreResponse toResponse(Semestre entity);
}
