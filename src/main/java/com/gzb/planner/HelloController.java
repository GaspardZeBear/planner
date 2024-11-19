package com.gzb.planner;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@GetMapping("/hello")
	public String hello() {
		return "Hi Gzb Greetings from Spring Boot!";
	}
	@GetMapping("/index")
	public String index() {
		return "index";
	}

}
