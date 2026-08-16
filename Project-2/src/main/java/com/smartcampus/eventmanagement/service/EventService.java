package com.smartcampus.eventmanagement.service;

import com.smartcampus.eventmanagement.model.Event;
import com.smartcampus.eventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public void saveEvent(Event event) {
        eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> searchEvents(LocalDate date, String department, String type) {
        if (date == null && (department == null || department.isEmpty()) && (type == null || type.isEmpty())) {
            return eventRepository.findAll();
        }
        return eventRepository.findByFilters(date, 
                (department != null && department.isEmpty()) ? null : department, 
                (type != null && type.isEmpty()) ? null : type);
    }

    public List<String> getAllDepartments() {
        return eventRepository.findAllDepartments();
    }

    public List<String> getAllTypes() {
        return eventRepository.findAllTypes();
    }
}
