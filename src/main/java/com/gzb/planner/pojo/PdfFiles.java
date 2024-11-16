package com.gzb.planner.pojo;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;

public class PdfFiles {

  private String dir;
  private ArrayList<String> filesList;

  public PdfFiles(String dir) {
    this.dir=dir;
  }

  public ArrayList<String> getPdfFiles() {
    Path path = Paths.get(this.dir);
    filesList = new ArrayList<String>();
    try (DirectoryStream<Path> stream =
      Files.newDirectoryStream(path, "*.{pdf}")) {
      for (Path entry: stream) {
        System.out.println(entry.getFileName());
        filesList.add(entry.toString());
      }
    } catch (IOException x) {
    // IOException can never be thrown by the iteration.
    // In this snippet, it can // only be thrown by newDirectoryStream.
      System.err.println(x);
    }
    return(filesList);
  }

}
