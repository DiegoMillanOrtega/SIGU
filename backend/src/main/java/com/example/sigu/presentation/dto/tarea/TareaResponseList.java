package com.example.sigu.presentation.dto.tarea;

import java.util.List;

public record TareaResponseList(
        List<TareaResponse> allTareas,
        List<TareaResponse> pendientes,
        List<TareaResponse> completadas,
        List<TareaResponse> atrasadas,
        List<TareaResponse> hoy,
        TareaStasts stats
) {
}
