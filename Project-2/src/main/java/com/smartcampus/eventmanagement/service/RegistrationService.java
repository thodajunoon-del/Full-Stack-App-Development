package com.smartcampus.eventmanagement.service;

import com.smartcampus.eventmanagement.model.Registration;
import com.smartcampus.eventmanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    public void saveRegistration(Registration registration) {
        registrationRepository.save(registration);
    }

    public List<Registration> getRegistrationsByEmail(String email) {
        return registrationRepository.findByStudentEmail(email);
    }

    public List<Object[]> getRegistrationStats() {
        return registrationRepository.countRegistrationsPerEvent();
    }
    
    public Long getTotalRegistrations() {
        return registrationRepository.countTotalRegistrations();
    }
}
