package com.rang.companyhomepage.service;

import com.rang.companyhomepage.dao.MandaoReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MandaoReservationService {
    private final MandaoReservationRepository repository;

    public MandaoReservation save(MandaoReservation reservation) {
        return repository.save(reservation);
    }

    public List<MandaoReservation> findAll() {
        return repository.findAll();
    }
}