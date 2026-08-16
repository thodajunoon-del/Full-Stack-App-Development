package com.smartcampus.eventmanagement.controller;

import com.smartcampus.eventmanagement.model.Event;
import com.smartcampus.eventmanagement.model.Registration;
import com.smartcampus.eventmanagement.service.EventService;
import com.smartcampus.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class StudentController {

    @Autowired
    private EventService eventService;

    @Autowired
    private RegistrationService registrationService;

    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/events")
    public String listEvents(Model model) {
        model.addAttribute("events", eventService.getAllEvents());
        return "events";
    }

    @GetMapping("/events/{id}/register")
    public String showRegistrationForm(@PathVariable("id") Long id, Model model) {
        Event event = eventService.getEventById(id);
        if (event == null) {
            return "redirect:/events";
        }
        Registration registration = new Registration();
        registration.setEvent(event);
        model.addAttribute("registration", registration);
        model.addAttribute("event", event);
        return "register";
    }

    @PostMapping("/events/register")
    public String registerForEvent(@Valid @ModelAttribute("registration") Registration registration,
                                   BindingResult bindingResult, Model model) {
        
        Event event = eventService.getEventById(registration.getEvent().getId());
        registration.setEvent(event);
        
        if (bindingResult.hasErrors()) {
            model.addAttribute("event", event);
            return "register";
        }

        registrationService.saveRegistration(registration);
        return "redirect:/my-registrations?email=" + registration.getStudentEmail() + "&success=true";
    }

    @GetMapping("/my-registrations")
    public String viewMyRegistrations(@RequestParam(value = "email", required = false) String email, Model model) {
        if (email != null && !email.isEmpty()) {
            List<Registration> registrations = registrationService.getRegistrationsByEmail(email);
            model.addAttribute("registrations", registrations);
            model.addAttribute("email", email);
        }
        return "my-registrations";
    }
}
