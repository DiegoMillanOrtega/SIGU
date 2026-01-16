package com.example.sigu.presentation.controller;

import com.example.sigu.persistence.entity.Archivo;
import com.example.sigu.presentation.dto.archivo.ArchivoRequest;
import com.example.sigu.presentation.dto.archivo.ArchivoResponse;
import com.example.sigu.service.interfaces.IArchivoService;
import com.example.sigu.util.mapper.ArchivoMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/archivos")
@RequiredArgsConstructor
public class ArchivoController {

    private final IArchivoService archivoService;
    private final ArchivoMapper  archivoMapper;

    @GetMapping
    public List<ArchivoResponse> findAll(){
        return archivoService.findAll()
                .stream()
                .map(archivoMapper::toResponse)
                .toList();
    }

    @GetMapping("/semestre-activo")
    public List<ArchivoResponse> findAllBySemestreActivo(){
        return archivoService.findAllBySemestreActivo()
                .stream()
                .map(archivoMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArchivoResponse> findById(@PathVariable Long id){
        return ResponseEntity.ok(archivoMapper.toResponse(archivoService.findById(id)));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArchivoResponse> subirArchivo(
            @Valid @ModelAttribute ArchivoRequest request,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        Archivo archivoGuardado = archivoService.guardarArchivo(file, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(archivoMapper.toResponse(archivoGuardado));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws IOException {
        archivoService.eliminarArchivo(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArchivoResponse> actualizarArchivo(
            @PathVariable Long id,
            @Valid @ModelAttribute ArchivoRequest request,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) throws IOException {
        Archivo archivoActualizado = archivoService.actualizarArchivo(id, request, file);

        return ResponseEntity.ok(archivoMapper.toResponse(archivoActualizado));
    }
}
