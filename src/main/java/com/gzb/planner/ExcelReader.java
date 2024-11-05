package com.gzb.planner;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

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
		ArrayList<PlanningItem> itemList=new ExcelProcessor("Sample.xlsx").getItemList();
		return(new Planning(itemList).toJson());
	}

}

