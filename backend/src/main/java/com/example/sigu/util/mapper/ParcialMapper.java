package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Materia;
import com.example.sigu.persistence.entity.Parcial;
import com.example.sigu.presentation.dto.parcial.ParcialRequest;
import com.example.sigu.presentation.dto.parcial.ParcialResponse;
import com.example.sigu.service.exception.MateriaNotFoundException;
import com.example.sigu.service.interfaces.IMateriaService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Service;

@Mapper(
        componentModel = "spring",
        uses = { MateriaMapper.class }
)
public interface ParcialMapper {

    @Mapping(target = "materia", ignore = true)
    Parcial toEntity(ParcialRequest request);

    @Mapping(target = "materiaId", source = "parcial.materia.id")
    @Mapping(target = "materiaNombre", source = "parcial.materia.nombre")
    ParcialResponse toResponse(Parcial parcial);
}
