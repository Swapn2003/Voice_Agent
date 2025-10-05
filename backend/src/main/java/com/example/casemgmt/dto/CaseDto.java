package com.example.casemgmt.dto;

import com.example.casemgmt.model.CaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CaseDto {
    
    private UUID id;
    
    @NotBlank
    private String caseId;
    
    @NotBlank
    private String type;
    
    @NotNull
    private CaseStatus status;
    
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;
    
    @NotBlank
    private String owner;
    
    private String description;
    private List<String> attachments;
    
    @NotBlank
    private String bank;
    
    private BigDecimal fineAmount;
    private String notes;
    
    private String complainantType;
    private String complainantCompany;
    private String complainantIca;
    private String complainantCountry;
    private String complainantRegion;
    
    private String acquirerPrimaryIca;
    private String acquirerCountry;
    private String acquirerRegion;
    
    private String subProgram;
    private String overallCaseLead;
    
    // Constructors
    public CaseDto() {}
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getCaseId() {
        return caseId;
    }
    
    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public CaseStatus getStatus() {
        return status;
    }
    
    public void setStatus(CaseStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
    
    public LocalDateTime getLastUpdatedDate() {
        return lastUpdatedDate;
    }
    
    public void setLastUpdatedDate(LocalDateTime lastUpdatedDate) {
        this.lastUpdatedDate = lastUpdatedDate;
    }
    
    public String getOwner() {
        return owner;
    }
    
    public void setOwner(String owner) {
        this.owner = owner;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getAttachments() {
        return attachments;
    }
    
    public void setAttachments(List<String> attachments) {
        this.attachments = attachments;
    }
    
    public String getBank() {
        return bank;
    }
    
    public void setBank(String bank) {
        this.bank = bank;
    }
    
    public BigDecimal getFineAmount() {
        return fineAmount;
    }
    
    public void setFineAmount(BigDecimal fineAmount) {
        this.fineAmount = fineAmount;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public String getComplainantType() {
        return complainantType;
    }
    
    public void setComplainantType(String complainantType) {
        this.complainantType = complainantType;
    }
    
    public String getComplainantCompany() {
        return complainantCompany;
    }
    
    public void setComplainantCompany(String complainantCompany) {
        this.complainantCompany = complainantCompany;
    }
    
    public String getComplainantIca() {
        return complainantIca;
    }
    
    public void setComplainantIca(String complainantIca) {
        this.complainantIca = complainantIca;
    }
    
    public String getComplainantCountry() {
        return complainantCountry;
    }
    
    public void setComplainantCountry(String complainantCountry) {
        this.complainantCountry = complainantCountry;
    }
    
    public String getComplainantRegion() {
        return complainantRegion;
    }
    
    public void setComplainantRegion(String complainantRegion) {
        this.complainantRegion = complainantRegion;
    }
    
    public String getAcquirerPrimaryIca() {
        return acquirerPrimaryIca;
    }
    
    public void setAcquirerPrimaryIca(String acquirerPrimaryIca) {
        this.acquirerPrimaryIca = acquirerPrimaryIca;
    }
    
    public String getAcquirerCountry() {
        return acquirerCountry;
    }
    
    public void setAcquirerCountry(String acquirerCountry) {
        this.acquirerCountry = acquirerCountry;
    }
    
    public String getAcquirerRegion() {
        return acquirerRegion;
    }
    
    public void setAcquirerRegion(String acquirerRegion) {
        this.acquirerRegion = acquirerRegion;
    }
    
    public String getSubProgram() {
        return subProgram;
    }
    
    public void setSubProgram(String subProgram) {
        this.subProgram = subProgram;
    }
    
    public String getOverallCaseLead() {
        return overallCaseLead;
    }
    
    public void setOverallCaseLead(String overallCaseLead) {
        this.overallCaseLead = overallCaseLead;
    }
}



