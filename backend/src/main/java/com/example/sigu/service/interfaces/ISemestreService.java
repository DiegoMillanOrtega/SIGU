package com.example.sigu.service.interfaces;

import com.example.sigu.persistence.entity.Materia;
import com.example.sigu.persistence.entity.Semestre;
import com.example.sigu.presentation.dto.semestre.CargaAcademica;
import com.example.sigu.presentation.dto.semestre.SemestreRequest;
import com.example.sigu.presentation.dto.semestre.SemestreResponse;

import java.time.LocalDate;
import java.util.List;

public interface ISemestreService {
    List<SemestreResponse> findAll();
    Semestre findById(Long id);
    void  deleteById(Long id);
    Semestre save(SemestreRequest request);
    Semestre patch(Long id, SemestreRequest request);
    long obtenerSemanasRestantes(Long semestreId);
}
