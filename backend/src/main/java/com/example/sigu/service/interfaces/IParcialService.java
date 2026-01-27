package com.example.sigu.service.interfaces;

import com.example.sigu.persistence.entity.Parcial;
import com.example.sigu.presentation.dto.parcial.ParcialRequest;

import java.util.List;

public interface IParcialService {
    List<Parcial> findAll();
    List<Parcial> findAllBySemestreActivo();
    Parcial findById(Long id);
    Parcial save(ParcialRequest request);
    void delete(Long id);
}
