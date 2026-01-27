package com.example.sigu.service.interfaces;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.presentation.dto.tarea.*;

import java.util.List;

public interface ITareaService {
    Tarea save(TareaRequest request);
    Tarea patch(Long tareaId, TareaPatchRequest request);
    Tarea findById(Long id);
    List<Tarea> findAll();
    List<Tarea> findBySemestre(Long semestreId);
    void deleteById(Long id);

    TareaStasts getGlobalStats();


}
