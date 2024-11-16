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

import com.gzb.planner.pojo.PdfFiles;
import com.gzb.planner.pojo.PdfWorker;

@RestController
@EnableAutoConfiguration
public class PdfSplitter {


	//@RequestMapping(value="/dumby/{maxIndex}/{count}/{size}/{sleep}/{deepsleep}")
  //@ResponseBody
  //public Dumby dumby(@PathVariable("maxIndex") int maxIndex,@PathVariable("count") int count,@PathVariable("size") int size,@PathVariable("sleep") int sleep,@PathVariable("deepsleep") int deepsleep) {

	@RequestMapping("pdflist")
  @ResponseBody
	public String pdflist() {
    PdfFiles xf=new PdfFiles(".");
		ArrayList<String> xlst=xf.getPdfFiles();
		JSONArray j=new JSONArray();
		for ( String pdfFile : xlst) {
      j.add(pdfFile);
    }
    return(j.toJSONString());
	}

	@GetMapping("/pdfsplit/{pdfFile}")
  @ResponseBody
	public String index(@PathVariable String pdfFile) {
		PdfWorker pw=new PdfWorker(pdfFile);
		ArrayList<String> generatedPdf = pw.split();
		JSONArray j=new JSONArray();
		for ( String pdf : generatedPdf) {
      j.add(pdf);
    }
		return(j.toJSONString());
	}

}


