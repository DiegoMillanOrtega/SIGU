package com.example.sigu.presentation.dto.tarea;

public record TareaStasts(
        long totalCount,
        long pendientesCount,
        long completadasCount,
        long atrasadasCount,
        long hoyCount
) {
}
