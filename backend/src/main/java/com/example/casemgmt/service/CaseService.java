package com.example.casemgmt.service;

import com.example.casemgmt.dto.CaseDto;
import com.example.casemgmt.model.CaseEntity;
import com.example.casemgmt.model.CaseStatus;
import com.example.casemgmt.repository.CaseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CaseService {
    
    private static final Logger logger = LoggerFactory.getLogger(CaseService.class);
    
    @Autowired
    private CaseRepository caseRepository;
    
    public List<CaseDto> getAllCases() {
        logger.info("Retrieving all cases");
        return caseRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<CaseDto> getCasesByFilters(CaseStatus status, String type, String owner, 
                                         String bank, LocalDateTime dateFrom, LocalDateTime dateTo) {
        logger.info("Retrieving cases with filters: status={}, type={}, owner={}, bank={}, dateFrom={}, dateTo={}", 
                   status, type, owner, bank, dateFrom, dateTo);
        
        return caseRepository.findByFilters(status, type, owner, bank, dateFrom, dateTo).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // New: search by criteria list similar to searchCriteriaDTO
    public List<CaseDto> searchCasesByCriteria(List<Map<String, String>> criteria) {
        List<CaseDto> all = getAllCases();
        for (Map<String, String> c : criteria) {
            String field = c.getOrDefault("field", "");
            String operator = c.getOrDefault("operator", "CONTAINS");
            String value = c.getOrDefault("value", "");
            all = all.stream().filter(dto -> matches(dto, field, operator, value)).collect(Collectors.toList());
        }
        return all;
    }

    private boolean matches(CaseDto dto, String field, String operator, String value) {
        String target = switch (field) {
            case "CASEID" -> dto.getCaseId();
            case "CASESTATUS" -> dto.getStatus() != null ? dto.getStatus().name() : null;
            case "ASSIGNTONAME" -> dto.getOwner();
            case "COMPLAINANTCOMPANYNAME" -> dto.getBank();
            default -> "";
        };
        if (target == null) target = "";
        return switch (operator) {
            case "EQUAL_TO" -> target.equalsIgnoreCase(value);
            case "NOT_CONTAINS" -> !target.toLowerCase().contains(value.toLowerCase());
            default -> target.toLowerCase().contains(value.toLowerCase());
        };
    }
    
    public Optional<CaseDto> getCaseById(String caseId) {
        logger.info("Retrieving case with ID: {}", caseId);
        return caseRepository.findByCaseId(caseId)
                .map(this::convertToDto);
    }
    
    public CaseDto createCase(CaseDto caseDto) {
        logger.info("Creating new case with ID: {}", caseDto.getCaseId());
        
        if (caseRepository.existsByCaseId(caseDto.getCaseId())) {
            throw new IllegalArgumentException("Case with ID " + caseDto.getCaseId() + " already exists");
        }
        
        CaseEntity entity = convertToEntity(caseDto);
        entity.setCreatedDate(LocalDateTime.now());
        entity.setLastUpdatedDate(LocalDateTime.now());
        
        CaseEntity savedEntity = caseRepository.save(entity);
        logger.info("Successfully created case with ID: {}", savedEntity.getCaseId());
        
        return convertToDto(savedEntity);
    }
    
    public Optional<CaseDto> updateCase(String caseId, CaseDto caseDto) {
        logger.info("Updating case with ID: {}", caseId);
        
        return caseRepository.findByCaseId(caseId)
                .map(existingEntity -> {
                    updateEntityFromDto(existingEntity, caseDto);
                    existingEntity.setLastUpdatedDate(LocalDateTime.now());
                    
                    CaseEntity savedEntity = caseRepository.save(existingEntity);
                    logger.info("Successfully updated case with ID: {}", caseId);
                    
                    return convertToDto(savedEntity);
                });
    }
    
    public String emailBank(String caseId) {
        logger.info("Sending email to bank for case: {}", caseId);
        
        // Simulate email sending with delay
        try {
            Thread.sleep(2000); // 2 second delay
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("Email simulation interrupted");
        }
        
        logger.info("Email sent successfully to bank for case: {}", caseId);
        return "Email sent successfully to bank for case " + caseId;
    }
    
    public String uploadEvidence(String caseId, MultipartFile file) {
        logger.info("Uploading evidence for case: {}, file: {}", caseId, file.getOriginalFilename());
        
        // Simulate file upload
        String filename = "evidence_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        
        // Update case with new attachment
        caseRepository.findByCaseId(caseId).ifPresent(entity -> {
            entity.getAttachments().add(filename);
            entity.setLastUpdatedDate(LocalDateTime.now());
            caseRepository.save(entity);
        });
        
        logger.info("Evidence uploaded successfully for case: {}, filename: {}", caseId, filename);
        return filename;
    }
    
    public List<CaseDto> processAlertFile(MultipartFile file) {
        logger.info("Processing alert file: {}", file.getOriginalFilename());
        
        List<CaseDto> createdCases = new ArrayList<>();
        
        try {
            // For demo purposes, we'll create mock cases based on the file
            // In a real application, you would parse the Excel/CSV file here
            createdCases = generateMockCasesFromFile(file);
            
            // Save all cases to database
            for (CaseDto caseDto : createdCases) {
                CaseEntity entity = convertToEntity(caseDto);
                entity.setCreatedDate(LocalDateTime.now());
                entity.setLastUpdatedDate(LocalDateTime.now());
                
                CaseEntity savedEntity = caseRepository.save(entity);
                logger.info("Created case from file: {}", savedEntity.getCaseId());
            }
            
            logger.info("Successfully processed alert file and created {} cases", createdCases.size());
            
        } catch (Exception e) {
            logger.error("Error processing alert file: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to process alert file: " + e.getMessage(), e);
        }
        
        return createdCases;
    }
    
    private List<CaseDto> generateMockCasesFromFile(MultipartFile file) {
        List<CaseDto> mockCases = new ArrayList<>();
        
        // Generate mock cases based on file name and size
        String fileName = file.getOriginalFilename();
        int caseCount = Math.min(5, Math.max(1, (int) (file.getSize() / 10000))); // 1-5 cases based on file size
        
        for (int i = 1; i <= caseCount; i++) {
            CaseDto caseDto = new CaseDto();
            
            // Generate unique case ID
            String timestamp = String.valueOf(System.currentTimeMillis()).substring(8);
            String caseId = String.format("MCC-CS-UPL-%s-%d", timestamp, i);
            
            caseDto.setCaseId(caseId);
            caseDto.setType("MCC");
            caseDto.setStatus(CaseStatus.NEW);
            caseDto.setOwner("MCCANALYST MCCANALYST");
            caseDto.setDescription("Case created from uploaded alert file: " + fileName);
            caseDto.setNotes("Automatically generated from file upload");
            caseDto.setBank("Uploaded Bank " + i);
            caseDto.setFineAmount(new java.math.BigDecimal(10000 + (i * 2000)));
            
            // Set complainant information
            caseDto.setComplainantType("Acquirer");
            caseDto.setComplainantCompany("Uploaded Bank " + i + " (" + (100000 + i) + ")");
            caseDto.setComplainantIca(String.valueOf(1000 + i));
            caseDto.setComplainantCountry("BRAZIL");
            caseDto.setComplainantRegion("Latin America and the Caribbean");
            
            // Set acquirer information
            caseDto.setAcquirerPrimaryIca(String.valueOf(1000 + i));
            caseDto.setAcquirerCountry("BRAZIL");
            caseDto.setAcquirerRegion("Latin America and the Caribbean");
            
            // Set program information
            String[] subPrograms = {"RECOVERY", "PROACTIVE", "REACTIVE"};
            caseDto.setSubProgram(subPrograms[i % subPrograms.length]);
            caseDto.setOverallCaseLead("MCCANALYST MCCANALYST");
            
            // Add file as attachment
            List<String> attachments = new ArrayList<>();
            attachments.add(fileName);
            caseDto.setAttachments(attachments);
            
            mockCases.add(caseDto);
        }
        
        return mockCases;
    }
    
    private CaseDto convertToDto(CaseEntity entity) {
        CaseDto dto = new CaseDto();
        dto.setId(entity.getId());
        dto.setCaseId(entity.getCaseId());
        dto.setType(entity.getType());
        dto.setStatus(entity.getStatus());
        dto.setCreatedDate(entity.getCreatedDate());
        dto.setLastUpdatedDate(entity.getLastUpdatedDate());
        dto.setOwner(entity.getOwner());
        dto.setDescription(entity.getDescription());
        dto.setAttachments(entity.getAttachments());
        dto.setBank(entity.getBank());
        dto.setFineAmount(entity.getFineAmount());
        dto.setNotes(entity.getNotes());
        dto.setComplainantType(entity.getComplainantType());
        dto.setComplainantCompany(entity.getComplainantCompany());
        dto.setComplainantIca(entity.getComplainantIca());
        dto.setComplainantCountry(entity.getComplainantCountry());
        dto.setComplainantRegion(entity.getComplainantRegion());
        dto.setAcquirerPrimaryIca(entity.getAcquirerPrimaryIca());
        dto.setAcquirerCountry(entity.getAcquirerCountry());
        dto.setAcquirerRegion(entity.getAcquirerRegion());
        dto.setSubProgram(entity.getSubProgram());
        dto.setOverallCaseLead(entity.getOverallCaseLead());
        return dto;
    }
    
    private CaseEntity convertToEntity(CaseDto dto) {
        CaseEntity entity = new CaseEntity();
        entity.setCaseId(dto.getCaseId());
        entity.setType(dto.getType());
        entity.setStatus(dto.getStatus());
        entity.setOwner(dto.getOwner());
        entity.setDescription(dto.getDescription());
        entity.setAttachments(dto.getAttachments() != null ? dto.getAttachments() : List.of());
        entity.setBank(dto.getBank());
        entity.setFineAmount(dto.getFineAmount());
        entity.setNotes(dto.getNotes());
        entity.setComplainantType(dto.getComplainantType());
        entity.setComplainantCompany(dto.getComplainantCompany());
        entity.setComplainantIca(dto.getComplainantIca());
        entity.setComplainantCountry(dto.getComplainantCountry());
        entity.setComplainantRegion(dto.getComplainantRegion());
        entity.setAcquirerPrimaryIca(dto.getAcquirerPrimaryIca());
        entity.setAcquirerCountry(dto.getAcquirerCountry());
        entity.setAcquirerRegion(dto.getAcquirerRegion());
        entity.setSubProgram(dto.getSubProgram());
        entity.setOverallCaseLead(dto.getOverallCaseLead());
        return entity;
    }
    
    private void updateEntityFromDto(CaseEntity entity, CaseDto dto) {
        if (dto.getType() != null) entity.setType(dto.getType());
        if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
        if (dto.getOwner() != null) entity.setOwner(dto.getOwner());
        if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
        if (dto.getAttachments() != null) entity.setAttachments(dto.getAttachments());
        if (dto.getBank() != null) entity.setBank(dto.getBank());
        if (dto.getFineAmount() != null) entity.setFineAmount(dto.getFineAmount());
        if (dto.getNotes() != null) entity.setNotes(dto.getNotes());
        if (dto.getComplainantType() != null) entity.setComplainantType(dto.getComplainantType());
        if (dto.getComplainantCompany() != null) entity.setComplainantCompany(dto.getComplainantCompany());
        if (dto.getComplainantIca() != null) entity.setComplainantIca(dto.getComplainantIca());
        if (dto.getComplainantCountry() != null) entity.setComplainantCountry(dto.getComplainantCountry());
        if (dto.getComplainantRegion() != null) entity.setComplainantRegion(dto.getComplainantRegion());
        if (dto.getAcquirerPrimaryIca() != null) entity.setAcquirerPrimaryIca(dto.getAcquirerPrimaryIca());
        if (dto.getAcquirerCountry() != null) entity.setAcquirerCountry(dto.getAcquirerCountry());
        if (dto.getAcquirerRegion() != null) entity.setAcquirerRegion(dto.getAcquirerRegion());
        if (dto.getSubProgram() != null) entity.setSubProgram(dto.getSubProgram());
        if (dto.getOverallCaseLead() != null) entity.setOverallCaseLead(dto.getOverallCaseLead());
    }
}



