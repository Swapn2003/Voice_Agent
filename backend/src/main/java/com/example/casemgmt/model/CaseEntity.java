package com.example.casemgmt.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cases")
public class CaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @NotBlank
    @Column(name = "case_id", unique = true, nullable = false)
    private String caseId;
    
    @NotBlank
    @Column(name = "type", nullable = false)
    private String type;
    
    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(name = "status", nullable = false)
    private CaseStatus status;
    
    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;
    
    @UpdateTimestamp
    @Column(name = "last_updated_date")
    private LocalDateTime lastUpdatedDate;
    
    @NotBlank
    @Column(name = "owner", nullable = false)
    private String owner;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    @CollectionTable(name = "case_attachments", joinColumns = @JoinColumn(name = "case_id"))
    @Column(name = "attachment_filename")
    private List<String> attachments = new ArrayList<>();
    
    @NotBlank
    @Column(name = "bank", nullable = false)
    private String bank;
    
    @Column(name = "fine_amount", precision = 10, scale = 2)
    private BigDecimal fineAmount;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "complainant_type")
    private String complainantType;
    
    @Column(name = "complainant_company")
    private String complainantCompany;
    
    @Column(name = "complainant_ica")
    private String complainantIca;
    
    @Column(name = "complainant_country")
    private String complainantCountry;
    
    @Column(name = "complainant_region")
    private String complainantRegion;
    
    @Column(name = "acquirer_primary_ica")
    private String acquirerPrimaryIca;
    
    @Column(name = "acquirer_country")
    private String acquirerCountry;
    
    @Column(name = "acquirer_region")
    private String acquirerRegion;
    
    @Column(name = "sub_program")
    private String subProgram;
    
    @Column(name = "overall_case_lead")
    private String overallCaseLead;
    
    // Constructors
    public CaseEntity() {}
    
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



