package com.rang.companyhomepage.controller;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class ExceptionController {

    // 모든 예외를 한 번에 처리
    @ExceptionHandler(Exception.class)
    public String handleAllException(Exception ex, Model model) {
        model.addAttribute("code", "ERROR");
        model.addAttribute("msg", "현재 페이지에 오류가 생겼습니다.");
        return "exception/error";
    }

    // 404 에러 (페이지 없음)를 별도로 처리하고 싶을 때
    @ExceptionHandler(NoHandlerFoundException.class)
    public String handle404(NoHandlerFoundException ex, Model model) {
        model.addAttribute("code", "404");
        model.addAttribute("msg", "요청하신 페이지를 찾을 수 없습니다.");
        return "exception/GeneralExceptionHandler";
    }
}