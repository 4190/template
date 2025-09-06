package com.docker.java1.controllers;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/java-1")
@CrossOrigin(origins = "*")
//@CrossOrigin(origins = "http://localhost:4200")
public class TestStringController {

    @GetMapping("/get1")
    String get() {
        return "Hello World - service 1 is working";
    }
}
