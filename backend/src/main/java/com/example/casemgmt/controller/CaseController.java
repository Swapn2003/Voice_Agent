package com.example.casemgmt.controller;

import com.example.casemgmt.dto.CaseDto;
import com.example.casemgmt.model.CaseStatus;
import com.example.casemgmt.service.CaseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin(origins = "http://localhost:3000")
public class CaseController {
    
    private static final Logger logger = LoggerFactory.getLogger(CaseController.class);
    
    @Autowired
    private CaseService caseService;
    
    @GetMapping
    public ResponseEntity<List<CaseDto>> getAllCases(
            @RequestParam(required = false) CaseStatus status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String owner,
            @RequestParam(required = false) String bank,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTo) {
        
        try {
            List<CaseDto> cases;
            if (status != null || type != null || owner != null || bank != null || dateFrom != null || dateTo != null) {
                cases = caseService.getCasesByFilters(status, type, owner, bank, dateFrom, dateTo);
            } else {
                cases = caseService.getAllCases();
            }
            
            logger.info("Retrieved {} cases", cases.size());
            return ResponseEntity.ok(cases);
        } catch (Exception e) {
            logger.error("Error retrieving cases", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // New search endpoint to handle complex filter criteria
    @PostMapping("/searches")
    public ResponseEntity<List<CaseDto>> searchCases(@RequestBody Map<String, Object> searchBody) {
        try {
            // Expected body fields: pageLength, pageOffset, sortField, exportFlag, caseType, criteria[]
            // For demo, we only use criteria
            List<Map<String, String>> criteria = (List<Map<String, String>>) searchBody.getOrDefault("criteria", List.of());
            List<CaseDto> cases = caseService.searchCasesByCriteria(criteria);
            logger.info("Searched cases with {} criteria, found {} results", criteria.size(), cases.size());
            return ResponseEntity.ok(cases);
        } catch (Exception e) {
            logger.error("Error searching cases", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{caseId}")
    public ResponseEntity<CaseDto> getCase(@PathVariable String caseId) {
        try {
            Optional<CaseDto> caseDto = caseService.getCaseById(caseId);
            if (caseDto.isPresent()) {
                logger.info("Retrieved case: {}", caseId);
                return ResponseEntity.ok(caseDto.get());
            } else {
                logger.warn("Case not found: {}", caseId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error retrieving case: {}", caseId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping
    public ResponseEntity<CaseDto> createCase(@Valid @RequestBody CaseDto caseDto) {
        try {
            CaseDto createdCase = caseService.createCase(caseDto);
            logger.info("Created new case: {}", createdCase.getCaseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCase);
        } catch (IllegalArgumentException e) {
            logger.warn("Invalid case data: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating case", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{caseId}")
    public ResponseEntity<CaseDto> updateCase(@PathVariable String caseId, @Valid @RequestBody CaseDto caseDto) {
        try {
            Optional<CaseDto> updatedCase = caseService.updateCase(caseId, caseDto);
            if (updatedCase.isPresent()) {
                logger.info("Updated case: {}", caseId);
                return ResponseEntity.ok(updatedCase.get());
            } else {
                logger.warn("Case not found for update: {}", caseId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating case: {}", caseId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{caseId}/email")
    public ResponseEntity<Map<String, String>> emailBank(@PathVariable String caseId) {
        try {
            String message = caseService.emailBank(caseId);
            Map<String, String> response = new HashMap<>();
            response.put("message", message);
            logger.info("Email sent for case: {}", caseId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error sending email for case: {}", caseId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/{caseId}/upload")
    public ResponseEntity<Map<String, String>> uploadEvidence(@PathVariable String caseId, 
                                                            @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                logger.warn("Empty file uploaded for case: {}", caseId);
                return ResponseEntity.badRequest().build();
            }
            
            String filename = caseService.uploadEvidence(caseId, file);
            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("message", "File uploaded successfully");
            logger.info("Evidence uploaded for case: {}, file: {}", caseId, filename);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error uploading evidence for case: {}", caseId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/upload-alert")
    public ResponseEntity<Map<String, Object>> uploadAlertFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                logger.warn("Empty alert file uploaded");
                return ResponseEntity.badRequest().build();
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || (!contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") &&
                !contentType.equals("application/vnd.ms-excel") && !contentType.equals("text/csv"))) {
                logger.warn("Invalid file type uploaded: {}", contentType);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid file type. Please upload Excel (.xlsx, .xls) or CSV files only.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            List<CaseDto> createdCases = caseService.processAlertFile(file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Alert file processed successfully");
            response.put("casesCreated", createdCases.size());
            response.put("cases", createdCases);
            response.put("filename", file.getOriginalFilename());
            
            logger.info("Alert file processed successfully: {}, created {} cases", file.getOriginalFilename(), createdCases.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing alert file: {}", file.getOriginalFilename(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error processing file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}



