package com.gzb.planner.pojo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.nio.file.Path; 
import java.nio.file.Paths; 
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;

//import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class PdfWorker {

  private String pdfFile;
  private ArrayList<String> itemList;
  //private HashMap<String,String> stylesMap;

  //---------------------------------------------------------------------------------------------
  public PdfWorker(String pdfFile) {
    //this.pdfFile=pdfFile;
    this.pdfFile = Paths.get(pdfFile).getFileName().toString(); 
  
  }

  public void deleteTarget(File file) {
      //File file = new File("splitter");
      for (File subfile : file.listFiles()) {
             // delete files and empty subfolders
        //subfile.delete();
        System.out.println(subfile);
      }
    }

  //---------------------------------------------------------------------------------------------
  public ArrayList<String> split() {
    try  {  
      itemList = new ArrayList<String>();
      deleteTarget(new File("splitter/generated"));
      readPDF();
    } catch(Exception e)  {  
      e.printStackTrace();  
    } 
    return(itemList);
  }

  //---------------------------------------------------------------------------------------------
  public void readPDF() {
    try {
      System.out.println("readPDF() ");
      PdfReader reader = new PdfReader("splitter/"+this.pdfFile);
      PdfDocument pdfDocument=new PdfDocument(reader);
      System.out.println("Document Metadata");
      int numPages = pdfDocument.getNumberOfPages();
      for (int index =1; index <= numPages; index++) {
         String pdfName="splitter/generated/" + this.pdfFile+"-"+String.valueOf(index)+".pdf";
         //System.out.println(subfile);
         System.out.println("Creating " + pdfName);
         createOnePagePDF(pdfDocument, pdfName, index);
         System.out.println("");
      }
     reader.close();
    } catch(Exception exp) {
     System.out.println(exp.getMessage());
   }
  }

   //---------------------------------------------------------------------------------------------
 public void createOnePagePDF(PdfDocument pdfDocument, String pdfName, int index) {
   try {
     FileOutputStream fileOutputStream=new FileOutputStream(pdfName);
     PdfWriter pdfWriter=new PdfWriter(pdfName);
     PdfDocument document=new PdfDocument(pdfWriter);
     //document.addNewPage(); 
     List<Integer> li=new ArrayList<Integer>();
     li.add(index);
     pdfDocument.copyPagesTo(li,document);
     document.close();
     fileOutputStream.flush();
     fileOutputStream.close();
     this.itemList.add(pdfName);
    }  catch(Exception exp) {
      System.out.println(exp.getMessage());
    }
 }
 

}
