package com.gzb.planner;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gzb.planner.pojo.ExcelProcessor;
import com.gzb.planner.pojo.PlanningItem;
import com.gzb.planner.pojo.Planning;



@RestController
public class ExcelReader {

	@GetMapping("/excelreader")
  @ResponseBody
	public String index() {
		ExcelProcessor xp=new ExcelProcessor("Sample.xlsx");
		ArrayList<PlanningItem> itemList=xp.getItemList();
		HashMap<String,String> colorMap =xp.getColorsMap();
		return(new Planning(itemList,colorMap).toJson());
	}

}

