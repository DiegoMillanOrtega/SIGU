package com.example.sigu.service.implementation;

import com.example.sigu.persistence.entity.Materia;
import com.example.sigu.persistence.entity.Semestre;
import com.example.sigu.persistence.repository.ISemestreRepository;
import com.example.sigu.presentation.dto.semestre.CargaAcademica;
import com.example.sigu.presentation.dto.semestre.EstadoSemestre;
import com.example.sigu.presentation.dto.semestre.SemestreRequest;
import com.example.sigu.presentation.dto.semestre.SemestreResponse;
import com.example.sigu.service.exception.ActiveSemestreAlreadyExistsException;
import com.example.sigu.service.exception.SemesterOverlapException;
import com.example.sigu.service.exception.SemestreNotFoundException;
import com.example.sigu.service.implementation.google.GoogleTasksService;
import com.example.sigu.service.interfaces.IMateriaService;
import com.example.sigu.service.interfaces.ISemestreService;
import com.example.sigu.service.interfaces.IUsuarioService;
import com.example.sigu.util.SecurityUtils;
import com.example.sigu.util.mapper.SemestreMapper;
import com.google.api.services.tasks.model.TaskList;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SemestreServiceImpl implements ISemestreService {


    private static final Logger log = LoggerFactory.getLogger(SemestreServiceImpl.class);
    private final ISemestreRepository semestreRepository;
    private final IUsuarioService usuarioService;
    private final SemestreMapper semestreMapper;
    private final SecurityUtils securityUtils;

    private final GoogleTasksService googleTasksService;


    @Override
    public List<SemestreResponse> findAll() {
        return semestreRepository.findAllByUsuarioIdWithMaterias(securityUtils.getCurrentUserId())
                .stream()
                .map(semestreMapper::toResponse)
                .toList();
    }

    @Override
    public Semestre findById(Long id) {
        return semestreRepository.findByIdAndUsuarioId(id,securityUtils.getCurrentUserId())
                .orElseThrow(() -> new SemestreNotFoundException(id));
    }

    @Override
    public void deleteById(Long id) {
        Semestre semestreToDelete = semestreRepository.findById(id)
                .orElseThrow(() -> new SemestreNotFoundException(id));

        if (!semestreToDelete.getUsuario().getId().equals(securityUtils.getCurrentUserId())) {
            throw new AccessDeniedException("Acceso denegado. No tienes permiso para eliminar este semestre.");
        }
        semestreRepository.delete(semestreToDelete);
    }

    @Override
    @Transactional
    public Semestre save(SemestreRequest request) {
//        if (semestreRepository.existsOverlap(request.fechaInicio(), request.fechaFin(), request.id(), request.usuarioId())) {
//            throw new SemesterOverlapException(request.fechaInicio(), request.fechaFin());
//        }

        //No pueden haber dos semestres activos
//        if (EstadoSemestre.ACTIVO.equals(request.estado()) && semestreRepository.existsByEstadoAndIdNot(EstadoSemestre.ACTIVO, request.id())) {
//            throw new ActiveSemestreAlreadyExistsException();
//        }

        Semestre semestre = semestreMapper.toEntity(request);
        semestre.setUsuario(usuarioService.findById(request.usuarioId()));

        try {
            semestre.setTaskListId(googleTasksService.createTaskList(semestre.getNombre()).getId());
        } catch (IOException ex) {
            log.error("Error al crear el task list", ex);
        }

        return semestreRepository.save(semestre);
    }

    @Override
    @Transactional
    public Semestre patch(Long id, SemestreRequest request) {
        Semestre semestreExistente = findById(id);

        semestreMapper.patchEntity(request, semestreExistente);

        if (request.nombre() != null) {
            try {
                TaskList taskList = googleTasksService.patchTaskList(semestreExistente.getTaskListId(), request.nombre());
                semestreExistente.setTaskListId(taskList.getId());
            } catch (IOException ex) {
                log.error("Error al patch task list", ex);
            }
        }

        return semestreRepository.save(semestreExistente);
    }

    @Override
    public long obtenerSemanasRestantes(Long semestreId) {
        Semestre semestre = findById(semestreId);
        LocalDate hoy = LocalDate.now();

        if (hoy.isAfter(semestre.getFechaFin())) return 0;
        return ChronoUnit.WEEKS.between(hoy, semestre.getFechaFin());
    }




}
