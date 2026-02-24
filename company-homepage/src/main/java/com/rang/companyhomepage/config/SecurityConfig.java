package com.rang.companyhomepage.config; // 본인의 패키지 경로 확인

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // 주석 해제: 보안 기능을 활성화합니다.
@RequiredArgsConstructor
public class SecurityConfig {

    // 1. 비밀번호 암호화 빈 (KISS: 가장 널리 쓰이는 BCrypt 사용)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. HTTP 보안 설정 (가장 핵심 로직)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        // 1. 누구나 볼 수 있는 페이지 (홈페이지, 숙소 리스트, 정적 리소스)
                        .requestMatchers("/", "/index.html", "/accommodation/list", "/css/**", "/js/**").permitAll()

                        // 2. 로그인이 필요한 페이지 (숙소 예약, 마이페이지 등 - 추후 확장)
                        .requestMatchers("/accommodation/reserve/**", "/member/mypage").authenticated()

                        .anyRequest().permitAll() // 우선 개발 편의를 위해 나머지도 허용 (나중에 바꾸세요!)
                )
                .formLogin(formLogin -> formLogin
                        .loginPage("/") // 로그인 페이지 경로 (메인화면을 로그인창으로 쓰실 계획인가요?)
                        .loginProcessingUrl("/member/login") // 실제 로그인 처리를 수행할 URL
                        .defaultSuccessUrl("/main", true) // 로그인 성공 시 이동할 페이지
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/") // 로그아웃 성공 시 이동할 페이지
                        .invalidateHttpSession(true) // 세션 무효화
                        .permitAll()
                )
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .maximumSessions(1) // 동시 접속 제한 (보안 강화)
                        .maxSessionsPreventsLogin(true) // 중복 로그인 방지
                );

        return http.build();
    }

    // 3. 정적 리소스(CSS, JS, 이미지) 보안 무시 설정
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/resources/**", "/static/**", "/favicon.ico");
    }
}