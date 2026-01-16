package com.example.sigu.service.implementation;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.persistence.repository.ITareaRepository;
import com.example.sigu.presentation.dto.tarea.*;
import com.example.sigu.service.exception.GoogleIntegrationException;
import com.example.sigu.service.exception.TareaNotFoundException;
import com.example.sigu.service.implementation.google.GoogleTasksService;
import com.example.sigu.service.interfaces.IArchivoService;
import com.example.sigu.service.interfaces.IMateriaService;
import com.example.sigu.service.interfaces.ITareaService;
import com.example.sigu.util.SecurityUtils;
import com.example.sigu.util.mapper.TareaMapper;
import com.google.api.services.tasks.model.Task;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TareaServiceImpl implements ITareaService {

    private final ITareaRepository repository;

    private final TareaMapper mapper;
    private final SecurityUtils securityUtils;

    //Servicios
    private final IMateriaService materiaService;
    private final IArchivoService archivoService;
    private final GoogleTasksService googleTasksService;

    @Override
    @Transactional
    public Tarea save(TareaRequest request)  {
        try {
            Tarea tareaAGuardar = mapper.toEntity(request);

            tareaAGuardar.setMateria(materiaService.findById(request.materiaId()));

            if (request.archivoId() != null) tareaAGuardar.setArchivo(archivoService.findById(request.archivoId()));

            String semestreNombre = tareaAGuardar.getMateria().getSemestre().getNombre();

            String taskListId = googleTasksService.getOrCreateTaskList(semestreNombre);

            log.info("Sincronizando tarea '{}' con Google Tasks", tareaAGuardar.getTitulo());
            Task googleTask = googleTasksService.createTask(taskListId, tareaAGuardar);

            tareaAGuardar.setTaskId(googleTask.getId());
            tareaAGuardar.setTaskListId(taskListId);
            tareaAGuardar.setEstado(Estado.PENDIENTE);

            return repository.save(tareaAGuardar);
        } catch (IOException ex) {
            log.error("Error al sincronizar con Google Tasks: {}", ex.getMessage());
            throw new GoogleIntegrationException("No se pudo crear la tarea en Google Tasks", ex);
        }
    }

    @Override
    @Transactional
    public Tarea patch(Long tareaId, TareaPatchRequest request) {
        Tarea tarea = findById(tareaId);

        if (request.materiaId() != null) {
            tarea.setMateria(materiaService.findById(request.materiaId()));
        }

        if (request.archivoId() != null) tarea.setArchivo(archivoService.findById(request.archivoId()));

        mapper.updateEntityFromPatch(request, tarea);

        try {
            googleTasksService.patchTask(tarea);
            log.info("Tarea con ID {} actualizada en Google Tasks con exito", tarea.getId());
            return repository.save(tarea);
        } catch (IOException e) {
            log.error("Error al patch tarea con Google Tasks: {}", e.getMessage());
            throw new GoogleIntegrationException("No se pudo patch la tarea en Google Tasks", e);
        }
    }

    @Override
    public Tarea findById(Long id) {
        return repository.findByIdAndMateria_Semestre_UsuarioId(id, securityUtils.getCurrentUserId())
                .orElseThrow(() -> new TareaNotFoundException("No existe tarea asociada al ID: " + id));
    }

    @Override
    public List<Tarea> findAll(Long materiaId, EstadoTareaRequest estado) {
        return repository.findAll(securityUtils.getCurrentUserId(), estado.name(),  materiaId);
    }

    @Override
    public List<Tarea> findAll() {
        return repository.findAllByMateria_Semestre_UsuarioId(securityUtils.getCurrentUserId());
    }

    @Override
    public void deleteById(Long id) {
        Tarea tareaToDelete = findById(id);

        if (!tareaToDelete.getMateria().getSemestre().getUsuario().getId().equals(securityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("\"Acceso Denegado: No tienes permiso para eliminar la tarea con ID: \" + id");
        }

        try {
            googleTasksService.deleteTask(tareaToDelete.getTaskListId(), tareaToDelete.getTaskId());
            log.info("Tarea con ID {} eliminada en Google Tasks", id);

            repository.delete(tareaToDelete);
        } catch (IOException ex) {
            log.error("Error al eliminar tarea con Google Tasks: {}", ex.getMessage());
            throw new GoogleIntegrationException("No se pudo eliminar la tarea en Google Tasks", ex);
        }

    }

    @Override
    public TareaStasts getGlobalStats() {
        return repository.getGlobalStats();
    }



}
