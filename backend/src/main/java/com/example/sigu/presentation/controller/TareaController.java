package com.example.sigu.presentation.controller;

import com.example.sigu.persistence.entity.Tarea;
import com.example.sigu.persistence.enums.Estado;
import com.example.sigu.presentation.dto.tarea.*;
import com.example.sigu.service.interfaces.ITareaService;
import com.example.sigu.util.mapper.TareaMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/tareas")
@RequiredArgsConstructor
public class TareaController {

    private final ITareaService service;
    private final TareaMapper mapper;

    @GetMapping
    public List<TareaResponse> findAll(
            @RequestParam(required = false) Long materiaId,
            @RequestParam(required = false) EstadoTareaRequest estado
    ) {
        return service.findAll(materiaId, estado).stream().map(mapper::toResponse).toList();
    }

    @GetMapping("/stats")
    public TareaStasts tareasStats() {
        return service.getGlobalStats();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TareaResponse> findById(@PathVariable Long id){
        return ResponseEntity.ok(mapper.toResponse(service.findById(id)));
    }


    @PostMapping
    public ResponseEntity<TareaResponse> save(@Valid @RequestBody TareaRequest request){
        Tarea tareaSaved = service.save(request);
        return ResponseEntity
                .created(URI.create("/api/tareas/"+ tareaSaved.getId()))
                .body(mapper.toResponse(tareaSaved));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TareaResponse> patch(@PathVariable Long id, @Valid @RequestBody TareaPatchRequest request) {
        return ResponseEntity.ok(mapper.toResponse(service.patch(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
