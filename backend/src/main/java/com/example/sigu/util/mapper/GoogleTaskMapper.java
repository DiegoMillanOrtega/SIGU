package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.persistence.enums.Estado;
import com.google.api.client.util.DateTime;
import com.google.api.services.tasks.model.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper(
        componentModel = "spring"
)
public interface GoogleTaskMapper {


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", source = "titulo")
    @Mapping(target = "notes", expression = "java(formatNotes(tarea))")
    @Mapping(target = "due", expression = "java(formatDueDate(tarea))")
    @Mapping(target = "status", expression = "java(mapStatus(tarea))")
    Task toTask(Tarea tarea);

    default String formatNotes(Tarea tarea) {
        if (tarea.getDescripcion() == null) return null;

        return """
               Prioridad: %s
               %s
               """.formatted(tarea.getPrioridad(), tarea.getDescripcion());
    }

    default String formatDueDate(Tarea tarea) {
        if (tarea.getFechaEntrega() == null) return null;

        return tarea.getFechaEntrega()
                .atTime(23, 59)
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toString(); // RFC3339 compatible
    }

    default String mapStatus(Tarea tarea) {
        return switch (tarea.getEstado()) {
            case null -> "needsAction";
            case Estado e -> e.getGoogleStatus();
        };
    }
}
