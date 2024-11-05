package com.gzb.planner.pojo;


import java.io.File;  
import java.io.FileInputStream;  
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;  
import org.apache.poi.ss.usermodel.Cell;  
import org.apache.poi.ss.usermodel.Row;  
import org.apache.poi.xssf.usermodel.XSSFSheet;  
import org.apache.poi.xssf.usermodel.XSSFWorkbook;  
import com.gzb.planner.pojo.PlanningItem; 


public class ExcelProcessor {

  private String excelFile;
  private ArrayList<PlanningItem> itemList;

  public ExcelProcessor(String excelFile) {
    this.excelFile=excelFile;
    process();
  }
  public void process() {
    getColors();
    getPlanning();
  }

  public void getColors() {
  }

  public void getPlanning() {
    try  {  
      FileInputStream fis = new FileInputStream(new File(excelFile));
      //creating Workbook instance that refers to .xlsx file  
      XSSFWorkbook wb = new XSSFWorkbook(fis); 
      XSSFSheet sheet = wb.getSheet("Planning"); 
      if ( sheet == null ) { 
        sheet = wb.getSheetAt(0);     
      }  
      Iterator<Row> itr = sheet.iterator();    //iterating over excel file
      Row row1=itr.next();  // skip first line
      itemList = new ArrayList<PlanningItem>();
      while (itr.hasNext())  {  
        Row row = itr.next(); 
        PlanningItem item=new PlanningItem(); 
        Iterator<Cell> cellIterator = row.cellIterator();  
        while (cellIterator.hasNext())  {  
          Cell cell = cellIterator.next();
          //if (cell==null) {
          //  System.out.println("Empty cell");
          //}
          //System.out.println("index " + cell.getColumnIndex());  
          switch (cell.getCellType()) {  
            case STRING:    //field that represents string cell type  
              item.setIdx(cell.getColumnIndex(),cell.getStringCellValue());  
              //System.out.print(cell.getStringCellValue()+"|"); 
              break;  
            case NUMERIC:    //field that represents number cell type  
              item.setIdx(cell.getColumnIndex(),String.valueOf(cell.getNumericCellValue()));  
              break;  
            default: 
              item.setIdx(cell.getColumnIndex(),"");
              //System.out.print(" |"); 
              break;
          } 
        }  
        itemList.add(item);
      //System.out.println("");  
      }  
    } catch(Exception e)  {  
      e.printStackTrace();  
    }  
}  

public ArrayList<PlanningItem> getItemList() {
    return(itemList);
  }
}
