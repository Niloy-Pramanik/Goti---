package com.prokoi.dashboard;

import com.prokoi.dashboard.dto.ReportResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/api/reports")
    public ResponseEntity<ReportResponse> getAdminReports(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        try {
            return ResponseEntity.ok(reportService.getAdminReports(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/api/reports/projects")
    public ResponseEntity<java.util.List<com.prokoi.dashboard.dto.ProjectReportDTO>> getProjectsReport(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        try {
            return ResponseEntity.ok(reportService.getProjectsReport(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/api/reports/tasks")
    public ResponseEntity<java.util.List<com.prokoi.dashboard.dto.TaskReportDTO>> getTasksReport(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        try {
            return ResponseEntity.ok(reportService.getTasksReport(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @GetMapping("/api/reports/timeline")
    public ResponseEntity<java.util.List<com.prokoi.dashboard.dto.TeamTimelineDTO>> getTeamTimeline(Authentication auth) {
        UUID userId = (UUID) auth.getPrincipal();
        try {
            return ResponseEntity.ok(reportService.getTeamTimeline(userId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
