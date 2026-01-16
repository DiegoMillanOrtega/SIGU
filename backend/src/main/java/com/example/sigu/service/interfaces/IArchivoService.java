package com.example.sigu.service.interfaces;

import com.example.sigu.persistence.entity.Archivo;
import com.example.sigu.presentation.dto.archivo.ArchivoRequest;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IArchivoService {
    Archivo guardarArchivo(MultipartFile file, ArchivoRequest request) throws IOException;
    Archivo findById(Long id);
    List<Archivo> findAll();
    List<Archivo> findAllBySemestreActivo();
    void eliminarArchivo(Long id) throws IOException;
    Archivo actualizarArchivo(Long id, ArchivoRequest request, MultipartFile file) throws IOException;
}
