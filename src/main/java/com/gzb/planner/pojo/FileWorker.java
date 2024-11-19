package com.gzb.planner.pojo;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.FileSystem;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.nio.file.Files;


public class FileWorker {

  private String dir;
  private String glob;
  private ArrayList<String> filesList;

  public FileWorker(String dir,String glob) {
    this.dir=dir;
    this.glob=glob;
  }

  public ArrayList<String> getFiles() {
    Path path = Paths.get(this.dir);
    filesList = new ArrayList<String>();
    try (DirectoryStream<Path> stream =
      Files.newDirectoryStream(path, this.glob)) {
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