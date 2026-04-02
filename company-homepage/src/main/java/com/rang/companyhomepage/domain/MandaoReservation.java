package com.rang.companyhomepage.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter @Setter
public class MandaoReservation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String guestName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private String status = "PENDING";
}