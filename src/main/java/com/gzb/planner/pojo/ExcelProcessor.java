package com.gzb.planner.pojo;


import java.io.File;  
import java.io.FileInputStream;  
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;  
import java.util.HashMap;
import org.apache.poi.ss.usermodel.Cell;  
import org.apache.poi.ss.usermodel.Row;  
import org.apache.poi.xssf.usermodel.XSSFSheet;  
import org.apache.poi.xssf.usermodel.XSSFWorkbook;  
import com.gzb.planner.pojo.PlanningItem; 


public class ExcelProcessor {

  private String excelFile;
  private ArrayList<PlanningItem> itemList;
  private HashMap<String,String> colorsMap;

  public ExcelProcessor(String excelFile) {
    this.excelFile=excelFile;
    process();
  }
  public void process() {
    try  {  
      FileInputStream fis = new FileInputStream(new File(excelFile));
      XSSFWorkbook wb = new XSSFWorkbook(fis); 
      getColors(wb);
      getPlanning(wb);
    } catch(Exception e)  {  
      e.printStackTrace();  
    } 
  }

  public void getColors(XSSFWorkbook wb) {
    XSSFSheet sheet = wb.getSheet("Colors"); 
    if ( sheet == null ) { 
      return;     
    }  
    Iterator<Row> itr = sheet.iterator();    //iterating over excel file
    colorsMap = new HashMap<String,String>();
    while (itr.hasNext())  {  
      Row row = itr.next(); 
      if (row.getLastCellNum() > 1) {
        Cell cell = row.getCell(0);
        colorsMap.put(cell.getStringCellValue(), row.getCell(1).getStringCellValue());
      } else {
        System.out.println("Missing col in colors");
      }
    }     
  }

  public void getPlanning(XSSFWorkbook wb) {
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
        switch (cell.getCellType()) {  
          case STRING:    //field that represents string cell type  
            item.setIdx(cell.getColumnIndex(),cell.getStringCellValue());  
            break;  
          case NUMERIC:    //field that represents number cell type  
            item.setIdx(cell.getColumnIndex(),String.valueOf(cell.getNumericCellValue()));  
            break;  
          default: 
            item.setIdx(cell.getColumnIndex(),"");
            break;
        } 
      }  
      itemList.add(item);
      //System.out.println("");  
    }  
  }  

  public ArrayList<PlanningItem> getItemList() {
    return(itemList);
  }
  
  public HashMap<String,String> getColorsMap() {
    return(colorsMap);
  }
 
}
