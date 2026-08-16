package com.smartcampus.eventmanagement.repository;

import com.smartcampus.eventmanagement.model.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentEmail(String studentEmail);

    @Query("SELECT r.event.name, COUNT(r) FROM Registration r GROUP BY r.event.name")
    List<Object[]> countRegistrationsPerEvent();

    @Query("SELECT COUNT(r) FROM Registration r")
    Long countTotalRegistrations();
}
