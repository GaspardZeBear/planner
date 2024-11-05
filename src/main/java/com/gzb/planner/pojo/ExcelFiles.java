package com.gzb.planner.pojo;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystem;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;


public class ExcelFiles {

  private String dir;

  public ExcelFiles(String dir) {
    this.dir=dir;
  }

  public String getExcelFiles() {
    Path path = Paths.get(this.dir);
    try (DirectoryStream<Path> stream =
      Files.newDirectoryStream(path, "*.{xlsx}")) {
      for (Path entry: stream) {
        System.out.println(entry.getFileName());
      }
    } catch (IOException x) {
    // IOException can never be thrown by the iteration.
    // In this snippet, it can // only be thrown by newDirectoryStream.
      System.err.println(x);
    }
    return("");
  }
}
