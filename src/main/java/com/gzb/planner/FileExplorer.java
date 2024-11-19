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
import com.gzb.planner.pojo.FileWorker;

@RestController
@EnableAutoConfiguration

@RequestMapping("/explore")
public class FileExplorer {

	//@RequestMapping(value="/dumby/{maxIndex}/{count}/{size}/{sleep}/{deepsleep}")
  //@ResponseBody
  //public Dumby dumby(@PathVariable("maxIndex") int maxIndex,@PathVariable("count") int count,@PathVariable("size") int size,@PathVariable("sleep") int sleep,@PathVariable("deepsleep") int deepsleep) {

	@RequestMapping("/icslist")
  @ResponseBody
	public String icslist() {
		FileWorker fw=new FileWorker(".","*.ics");
		ArrayList<String> flst=fw.getFiles();
		JSONArray j=new JSONArray();
		for ( String f : flst) {
      j.add(f);
    }
    return(j.toJSONString());
	}


}

