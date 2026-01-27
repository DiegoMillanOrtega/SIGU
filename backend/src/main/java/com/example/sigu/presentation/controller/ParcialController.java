package com.example.sigu.presentation.controller;


import com.example.sigu.persistence.entity.Parcial;
import com.example.sigu.presentation.dto.parcial.ParcialRequest;
import com.example.sigu.presentation.dto.parcial.ParcialResponse;
import com.example.sigu.service.interfaces.IParcialService;
import com.example.sigu.util.mapper.ParcialMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/parciales")
@RequiredArgsConstructor
public class ParcialController {

    private final IParcialService service;
    private final ParcialMapper mapper;

    @GetMapping
    public List<ParcialResponse> findAll() {
        return service.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @GetMapping("semestre-activo")
    public List<ParcialResponse> findAllSemestreActivo() {
        return service.findAllBySemestreActivo()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcialResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toResponse(service.findById(id)));

    }

    @PostMapping
    public ResponseEntity<ParcialResponse> save(@Valid @RequestBody ParcialRequest request) {
        Parcial parcialSaved = service.save(request);

        return ResponseEntity
                .created(URI.create("/api/parciales/" + parcialSaved.getId()))
                .body(mapper.toResponse(parcialSaved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
