package com.example.sigu.util.mapper;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.presentation.dto.tarea.TareaPatchRequest;
import com.google.api.client.util.DateTime;
import com.google.api.services.tasks.model.Task;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper(componentModel = "spring")
public interface GoogleTaskMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", expression = "java(formatTitle(tarea))")
    @Mapping(target = "notes", expression = "java(formatNotes(tarea))")
    @Mapping(target = "due", expression = "java(formatDueDate(tarea))")
    @Mapping(target = "status", expression = "java(mapStatus(tarea))")
    Task toTask(Tarea tarea);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "title", expression = "java(needsTitleUpdate(request) ? formatTitle(entity) : null)")
    @Mapping(target = "notes", expression = "java(needsNotesUpdate(request) ? formatNotes(entity) : null)")
    @Mapping(target = "due", expression = "java(request.fechaEntrega() != null ? formatDueDate(entity) : null)")
    Task toTaskPatch(TareaPatchRequest request, @Context Tarea entity);

    // Comprueba si hubo cambios que afecten a Google Tasks
    default boolean hasGoogleRelatedChanges(TareaPatchRequest request) {
        return request.titulo() != null ||
                request.prioridad() != null ||
                request.descripcion() != null ||
                request.fechaEntrega() != null ||
                request.materiaId() != null; // Si cambia la materia, cambia el título
    }

    default boolean needsTitleUpdate(TareaPatchRequest request) {
        return request.titulo() != null || request.materiaId() != null;
    }

    default boolean needsNotesUpdate(TareaPatchRequest request) {
        return request.prioridad() != null || request.descripcion() != null || request.materiaId() != null;
    }


    default String formatTitle(Tarea tarea) {
        return String.format("[%s] - %s",
                tarea.getMateria().getNombre(),
                tarea.getTitulo());
    }

    default String formatNotes(Tarea tarea) {
        String emoji = getPrioridadEmoji(tarea.getPrioridad().toString());
        return """
        %s Prioridad: %s
        
        📚 Materia: %s
        
        📝 Detalles:
        %s
        """.formatted(
                emoji,
                tarea.getPrioridad(),
                tarea.getMateria().getNombre(),
                tarea.getDescripcion() != null ? tarea.getDescripcion() : "Sin descripción"
        );
    }

    default String getPrioridadEmoji(String prioridad) {
        return switch (prioridad.toUpperCase()) {
            case "ALTA" -> "🔴";
            case "MEDIA" -> "🟡";
            default -> "🟢";
        };
    }

    default String formatDueDate(Tarea tarea) {
        if (tarea.getFechaEntrega() == null) return null;

        ZonedDateTime zdt = tarea.getFechaEntrega()
                .atTime(23, 59)
                .atZone(ZoneId.systemDefault());

        // Google API espera RFC3339
        return new com.google.api.client.util.DateTime(zdt.toInstant().toEpochMilli()).toStringRfc3339();
    }

    default String mapStatus(Tarea tarea) {
        if (tarea.getEstado() == null) return "needsAction";
        // Asumiendo que tu enum Estado tiene un método getGoogleStatus()
        return tarea.getEstado().getGoogleStatus();
    }
}