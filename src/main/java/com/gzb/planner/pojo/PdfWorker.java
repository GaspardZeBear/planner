package com.gzb.planner.pojo;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.PdfWriter;

//import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class PdfWorker {

  private String pdfFile;
  private ArrayList<String> itemList;
  //private HashMap<String,String> stylesMap;

  public PdfWorker(String pdfFile) {
    this.pdfFile=pdfFile;
  }

  public ArrayList<String> split() {
    try  {  
      itemList = new ArrayList<String>();
      itemList.add("toto");
      itemList.add("titi");
      readPDF();
    } catch(Exception e)  {  
      e.printStackTrace();  
    } 
    return(itemList);
  }

  //---------------------------------------------------------------------------------------------
  public void readPDF() {
    try {
      PdfReader reader = new PdfReader(this.pdfFile);
      PdfDocument pdfDocument=new PdfDocument(reader);
      System.out.println("Document Metadata");
     // System.out.println(reader.().toString());
      System.out.println("--");

      int numPages = pdfDocument.getNumberOfPages();
      for (int index =1; index <= numPages; index++) {
         //byte[] pageBuf = reader.getPageContent(index);
         //String pageContent = new String(pageBuf);
         //System.out.println("Page - " + index);
         String pdfName=this.pdfFile+"-"+String.valueOf(index)+".pdf";
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
     //PdfDocument document= new P();
     
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
    }  catch(Exception exp) {
      System.out.println(exp.getMessage());
    }
 }
 

}
