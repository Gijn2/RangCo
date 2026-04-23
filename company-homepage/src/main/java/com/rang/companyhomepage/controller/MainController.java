package com.rang.companyhomepage.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {


    @GetMapping({"/", "/index"})
    public String index() {
        // src/main/resources/templates/index.html 호출
        return "index";
    }

    @GetMapping("/projectR")
    public String projectR() {
        // src/main/resources/templates/projectR.html 호출
        return "projectR";
    }

    @GetMapping("/projectM")
    public String projectM() {
        // src/main/resources/templates/projectM.html 호출
        return "projectM";
    }

    @GetMapping("/mandao")
    public String mandao() {
        // src/main/resources/templates/mandao.html 호출
        return "mandao";
    }

    @GetMapping("/communityRPoll")
    public String test() {
        // src/main/resources/templates/test.html 호출
        return "communityRPoll";
    }
}