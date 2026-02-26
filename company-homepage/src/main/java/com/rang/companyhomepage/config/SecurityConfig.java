//package com.rang.companyhomepage.config; // 본인의 패키지 경로 확인
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity // 주석 해제: 보안 기능을 활성화합니다.
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    // 1. 비밀번호 암호화 빈 (KISS: 가장 널리 쓰이는 BCrypt 사용)
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable()) // 초기 개발 시 편의를 위해 CSRF 비활성화 (선택)
//                .authorizeHttpRequests(authorize -> authorize
//                        // 1. static 폴더의 index.html과 정적 리소스들을 모두 허용
//                        .requestMatchers("/", "/index.html", "/static/**", "/css/**", "/js/**", "/images/**").permitAll()
//
//                        // 2. 나중에 만들 회원가입 관련 경로도 미리 허용
//                        .requestMatchers("/member/**").permitAll()
//
//                        // 3. 그 외의 페이지(숙소 관리, 마이페이지 등)만 로그인을 요구
//                        .anyRequest().authenticated()
//                )
//                .formLogin(form -> form
//                        // .loginPage("/") 부분을 삭제하거나 실제 로그인 전용 페이지로 변경하세요.
//                        // "/"로 설정하면 메인 페이지를 보려다 다시 메인(로그인창)으로 무한 루프가 생길 수 있습니다.
//                        .loginPage("/member/login") // 로그인 폼 페이지를 따로 만드는 것이 유지보수에 좋습니다.
//                        .permitAll()
//                )
//                .logout(logout -> logout.permitAll());
//
//        return http.build();
//    }
//
//    // 3. 정적 리소스(CSS, JS, 이미지) 보안 무시 설정
//    @Bean
//    public WebSecurityCustomizer webSecurityCustomizer() {
//        return (web) -> web.ignoring().requestMatchers("/resources/**", "/static/**", "/favicon.ico");
//    }
//}