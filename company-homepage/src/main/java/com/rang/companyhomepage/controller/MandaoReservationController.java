package com.rang.companyhomepage.controller;

import com.rang.companyhomepage.domain.MandaoReservation;
import com.rang.companyhomepage.service.MandaoReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MandaoReservationController {
    private final MandaoReservationService service;

    @PostMapping("/reservations")
    public ResponseEntity<String> requestReservation(@RequestBody MandaoReservation reservation) {
        service.save(reservation);
        return ResponseEntity.ok("만다오 예약 요청이 완료되었습니다.");
    }

    @GetMapping("/admin/reservations")
    public ResponseEntity<List<MandaoReservation>> getAdminReservations() {
        return ResponseEntity.ok(service.findAll());
    }
}