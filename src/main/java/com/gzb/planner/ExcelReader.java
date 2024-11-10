package com.gzb.planner;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.gzb.planner.pojo.ExcelFiles;
import com.gzb.planner.pojo.ExcelProcessor;
import com.gzb.planner.pojo.PlanningItem;
import com.gzb.planner.pojo.Planning;

@RestController
@EnableAutoConfiguration
public class ExcelReader {


	//@RequestMapping(value="/dumby/{maxIndex}/{count}/{size}/{sleep}/{deepsleep}")
  //@ResponseBody
  //public Dumby dumby(@PathVariable("maxIndex") int maxIndex,@PathVariable("count") int count,@PathVariable("size") int size,@PathVariable("sleep") int sleep,@PathVariable("deepsleep") int deepsleep) {

	@RequestMapping("/excellist")
  @ResponseBody
	public String excellist() {
		ExcelFiles xf=new ExcelFiles(".");
		ArrayList<String> xlst=xf.getExcelFiles();
		JSONArray j=new JSONArray();
		for ( String excelFile : xlst) {
      j.add(excelFile);
    }
    return(j.toJSONString());
	}

	@GetMapping("/excelreader/{excelFile}")
  @ResponseBody
	public String index(@PathVariable String excelFile) {
		ExcelProcessor xp=new ExcelProcessor(excelFile);
		ArrayList<PlanningItem> itemList=xp.getItemList();
		HashMap<String,String> colorMap =xp.getColorsMap();
		return(new Planning(itemList,colorMap).toJson());
	}

}

