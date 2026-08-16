package com.smartcampus.eventmanagement.controller;

import com.smartcampus.eventmanagement.model.Event;
import com.smartcampus.eventmanagement.service.EventService;
import com.smartcampus.eventmanagement.service.RegistrationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private EventService eventService;

    @Autowired
    private RegistrationService registrationService;

    @GetMapping("/login")
    public String login() {
        return "admin-login";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin-dashboard";
    }

    @GetMapping("/events")
    public String listEvents(@RequestParam(value = "date", required = false) LocalDate date,
                             @RequestParam(value = "department", required = false) String department,
                             @RequestParam(value = "type", required = false) String type,
                             Model model) {
        model.addAttribute("events", eventService.searchEvents(date, department, type));
        model.addAttribute("departments", eventService.getAllDepartments());
        model.addAttribute("types", eventService.getAllTypes());
        return "admin-events";
    }

    @GetMapping("/events/new")
    public String showCreateForm(Model model) {
        model.addAttribute("event", new Event());
        return "admin-event-form";
    }

    @PostMapping("/events/save")
    public String saveEvent(@Valid @ModelAttribute("event") Event event, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "admin-event-form";
        }
        eventService.saveEvent(event);
        return "redirect:/admin/events?success=true";
    }

    @GetMapping("/events/{id}/edit")
    public String showEditForm(@PathVariable("id") Long id, Model model) {
        Event event = eventService.getEventById(id);
        if (event == null) {
            return "redirect:/admin/events";
        }
        model.addAttribute("event", event);
        return "admin-event-form";
    }

    @GetMapping("/events/{id}/delete")
    public String deleteEvent(@PathVariable("id") Long id) {
        eventService.deleteEvent(id);
        return "redirect:/admin/events?deleted=true";
    }

    @GetMapping("/stats")
    public String showStats(Model model) {
        model.addAttribute("stats", registrationService.getRegistrationStats());
        model.addAttribute("totalRegistrations", registrationService.getTotalRegistrations());
        return "admin-stats";
    }
}
