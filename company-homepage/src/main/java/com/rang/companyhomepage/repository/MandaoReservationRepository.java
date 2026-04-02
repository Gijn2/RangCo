package com.rang.companyhomepage.repository;

import com.rang.companyhomepage.domain.MandaoReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface MandaoReservationRepository extends JpaRepository<MandaoReservation, Long> {
}