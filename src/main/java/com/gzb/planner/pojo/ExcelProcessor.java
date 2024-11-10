package com.gzb.planner.pojo;


import java.io.File;  
import java.io.FileInputStream;  
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;  
import java.util.HashMap;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;  
import org.apache.poi.xssf.usermodel.XSSFSheet;  
import org.apache.poi.xssf.usermodel.XSSFWorkbook;  
import com.gzb.planner.pojo.PlanningItem;

public class ExcelProcessor {

  private String excelFile;
  private ArrayList<PlanningItem> itemList;
  private HashMap<String,String> stylesMap;

  public ExcelProcessor(String excelFile) {
    this.excelFile=excelFile;
    process();
  }
  public void process() {
    try  {  
      FileInputStream fis = new FileInputStream(new File(excelFile));
      XSSFWorkbook wb = new XSSFWorkbook(fis); 
      computeStyles(wb);
      computePlanning(wb);
    } catch(Exception e)  {  
      e.printStackTrace();  
    } 
  }

  public void computeStyles(XSSFWorkbook wb) {
    XSSFSheet sheet = wb.getSheet("Colors"); 
    if ( sheet == null ) { 
      return;     
    }  
    Iterator<Row> itr = sheet.iterator();    //iterating over excel file
    Row row1=itr.next();  // skip first line
    stylesMap = new HashMap<String,String>();
    while (itr.hasNext())  {  
      Row row = itr.next(); 
      if (row.getLastCellNum() > 1) {
        Cell cell = row.getCell(0);
        stylesMap.put(cell.getStringCellValue(), row.getCell(1).getStringCellValue());
      } else {
        System.out.println("Missing col in colors");
      }
    }     
  }

  public void computePlanning(XSSFWorkbook wb) {
    XSSFSheet sheet = wb.getSheet("Planning"); 
    if ( sheet == null ) { 
      sheet = wb.getSheetAt(0);     
    }  
    Iterator<Row> itr = sheet.iterator();    //iterating over excel file
    Row row1=itr.next();  // skip first line
    itemList = new ArrayList<PlanningItem>();
    FormulaEvaluator evaluator=wb.getCreationHelper().createFormulaEvaluator();
    while (itr.hasNext())  {  
      Row row = itr.next(); 
      PlanningItem item=new PlanningItem(); 
      Iterator<Cell> cellIterator = row.cellIterator();  
      boolean keepRow=true;
      while (cellIterator.hasNext())  {  
        Cell cell = cellIterator.next();
        if (cell.getColumnIndex() == 0) {
          // Comment in first col
          System.out.println(" Comment !");
          keepRow=false;
          break;
        }
        switch (cell.getCellType()) {  
          case STRING:    //field that represents string cell type  
            item.setIdx(cell.getColumnIndex(),cell.getStringCellValue());  
            break;  
          case NUMERIC:    //field that represents number cell type  
            item.setIdx(cell.getColumnIndex(),String.valueOf(cell.getNumericCellValue()));  
            break;
          case FORMULA:    //field that represents number cell type  
            CellType cellType=evaluator.evaluateFormulaCell(cell);
            CellValue cellValue=evaluator.evaluate(cell);
            switch(cellType) {
              case STRING:  
                item.setIdx(cell.getColumnIndex(),String.valueOf(cellValue.getStringValue()));  
              break;
              case NUMERIC:    //field that represents number cell type  
                item.setIdx(cell.getColumnIndex(),String.valueOf(cellValue.getNumberValue()));  
                break; 
              default: 
                //item.setIdx(cell.getColumnIndex(),"???");
                keepRow=false;
                break; 
            }
            break;
          default: 
            //item.setIdx(cell.getColumnIndex(),"?");
            System.out.println(" cellType " + String.valueOf(cell.getCellType()));
            keepRow=false;
            break;
        } 
      }  
      if ( keepRow ) {
        itemList.add(item);
      }
      //System.out.println("");  
    }  
  }  

  public ArrayList<PlanningItem> getItemList() {
    return(itemList);
  }
  
  public HashMap<String,String> getStylesMap() {
    return(stylesMap);
  }
 
}
