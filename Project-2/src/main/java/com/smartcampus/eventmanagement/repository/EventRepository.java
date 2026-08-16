package com.smartcampus.eventmanagement.repository;

import com.smartcampus.eventmanagement.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    
    // Search events by various filters
    @Query("SELECT e FROM Event e WHERE " +
           "(:date is null or e.date = :date) and " +
           "(:department is null or e.department = :department) and " +
           "(:type is null or e.type = :type)")
    List<Event> findByFilters(@Param("date") LocalDate date, 
                              @Param("department") String department, 
                              @Param("type") String type);
                              
    @Query("SELECT DISTINCT e.department FROM Event e")
    List<String> findAllDepartments();
    
    @Query("SELECT DISTINCT e.type FROM Event e")
    List<String> findAllTypes();
}
