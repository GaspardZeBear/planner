package com.gzb.planner;


import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.springframework.util.StreamUtils;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import java.util.List;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gzb.planner.pojo.PdfFiles;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/download")
public class DownloadController {

    @GetMapping("/pdf/{path}/{pdfFile}")
    public void download (HttpServletRequest request, HttpServletResponse response,@PathVariable String path,@PathVariable String pdfFile) throws IOException {
        
        // The file to be downloaded.
        //Path file = Paths.get(path+"/"+pdfFile);
        // Usin path maybe dangerous !!!!
        Path file = Paths.get("splitter/"+pdfFile);
        response.setContentType("application/pdf");
        response.setContentLengthLong(Files.size(file));
        Files.copy(file, response.getOutputStream());
    }

    @GetMapping("/zip")
    public void zipDownload (HttpServletRequest request, HttpServletResponse response) throws IOException {
        
        // List of files to be downloaded
        //List<Path> files = Arrays.asList(Paths.get("E:\\test.mp4"), 
        //                            Paths.get("E:\\node.txt"), 
        //                            Paths.get("E:\\keys.txt"));
        PdfFiles xf=new PdfFiles("splitter");
        //ArrayList<String> afiles=xf.getPdfFiles();
        List<Path> files=xf.getPdfFiles().stream().map(x->Paths.get(x)).collect(Collectors.toList());
        response.setContentType("application/zip"); // zip archive format
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment()
                                                                            .filename("download.zip", StandardCharsets.UTF_8)
                                                                            .build()
                                                                            .toString());
        
        
        // Archiving multiple files and responding to the client
        try(ZipOutputStream zipOutputStream = new ZipOutputStream(response.getOutputStream())){
            for (Path file : files) {
                try (InputStream inputStream = Files.newInputStream(file)) {
                    zipOutputStream.putNextEntry(new ZipEntry(file.getFileName().toString()));
                    StreamUtils.copy(inputStream, zipOutputStream);
                    zipOutputStream.flush();
                }
            }
        }
    }


}

