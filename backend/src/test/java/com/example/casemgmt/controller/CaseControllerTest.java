package com.example.casemgmt.controller;

import com.example.casemgmt.model.CaseStatus;
import com.example.casemgmt.service.CaseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;

@WebMvcTest(CaseController.class)
class CaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CaseService caseService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCases() throws Exception {
        // Given
        List<com.example.casemgmt.dto.CaseDto> mockCases = Arrays.asList(
            createMockCaseDto("MCC-CS-REC-P-251001-18783"),
            createMockCaseDto("MCC-CS-PRO-A-251002-18784")
        );
        when(caseService.getAllCases()).thenReturn(mockCases);

        // When & Then
        mockMvc.perform(get("/api/cases"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].caseId").value("MCC-CS-REC-P-251001-18783"))
                .andExpect(jsonPath("$[1].caseId").value("MCC-CS-PRO-A-251002-18784"));
    }

    @Test
    void testGetCaseById() throws Exception {
        // Given
        String caseId = "MCC-CS-REC-P-251001-18783";
        com.example.casemgmt.dto.CaseDto mockCase = createMockCaseDto(caseId);
        when(caseService.getCaseById(caseId)).thenReturn(Optional.of(mockCase));

        // When & Then
        mockMvc.perform(get("/api/cases/{caseId}", caseId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.caseId").value(caseId))
                .andExpect(jsonPath("$.type").value("MCC"))
                .andExpect(jsonPath("$.status").value("NEW"));
    }

    @Test
    void testGetCaseByIdNotFound() throws Exception {
        // Given
        String caseId = "NON-EXISTENT-CASE";
        when(caseService.getCaseById(caseId)).thenReturn(Optional.empty());

        // When & Then
        mockMvc.perform(get("/api/cases/{caseId}", caseId))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateCase() throws Exception {
        // Given
        com.example.casemgmt.dto.CaseDto newCase = createMockCaseDto("MCC-CS-NEW-251003-18785");
        com.example.casemgmt.dto.CaseDto createdCase = createMockCaseDto("MCC-CS-NEW-251003-18785");
        createdCase.setId(UUID.randomUUID());
        
        when(caseService.createCase(any(com.example.casemgmt.dto.CaseDto.class))).thenReturn(createdCase);

        // When & Then
        mockMvc.perform(post("/api/cases")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCase)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.caseId").value("MCC-CS-NEW-251003-18785"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void testEmailBank() throws Exception {
        // Given
        String caseId = "MCC-CS-REC-P-251001-18783";
        when(caseService.emailBank(caseId)).thenReturn("Email sent successfully to bank for case " + caseId);

        // When & Then
        mockMvc.perform(post("/api/cases/{caseId}/email", caseId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Email sent successfully to bank for case " + caseId));
    }

    private com.example.casemgmt.dto.CaseDto createMockCaseDto(String caseId) {
        com.example.casemgmt.dto.CaseDto caseDto = new com.example.casemgmt.dto.CaseDto();
        caseDto.setCaseId(caseId);
        caseDto.setType("MCC");
        caseDto.setStatus(CaseStatus.NEW);
        caseDto.setOwner("MCCANALYST MCCANALYST");
        caseDto.setBank("Banco do Brasil, S.A.");
        caseDto.setFineAmount(new BigDecimal("15000.00"));
        caseDto.setCreatedDate(LocalDateTime.now());
        caseDto.setDescription("Mock case for testing");
        return caseDto;
    }

    @Test
    void testUploadAlertFile() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-alert.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "test file content".getBytes()
        );

        List<com.example.casemgmt.dto.CaseDto> mockCreatedCases = Arrays.asList(
                createMockCaseDto("MCC-CS-UPL-251008-18790"),
                createMockCaseDto("MCC-CS-UPL-251008-18791")
        );

        when(caseService.processAlertFile(any(MultipartFile.class))).thenReturn(mockCreatedCases);

        // When & Then
        mockMvc.perform(multipart("/api/cases/upload-alert")
                .file(file))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Alert file processed successfully"))
                .andExpect(jsonPath("$.casesCreated").value(2))
                .andExpect(jsonPath("$.filename").value("test-alert.xlsx"))
                .andExpect(jsonPath("$.cases").isArray())
                .andExpect(jsonPath("$.cases.length()").value(2));
    }

    @Test
    void testUploadAlertFileInvalidType() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "test file content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/cases/upload-alert")
                .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.error").value("Invalid file type. Please upload Excel (.xlsx, .xls) or CSV files only."));
    }

    @Test
    void testUploadAlertFileEmpty() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                new byte[0]
        );

        // When & Then
        mockMvc.perform(multipart("/api/cases/upload-alert")
                .file(file))
                .andExpect(status().isBadRequest());
    }
}



