package com.example.casemgmt.repository;

import com.example.casemgmt.model.CaseEntity;
import com.example.casemgmt.model.CaseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseRepository extends JpaRepository<CaseEntity, UUID> {
    
    Optional<CaseEntity> findByCaseId(String caseId);
    
    List<CaseEntity> findByStatus(CaseStatus status);
    
    List<CaseEntity> findByType(String type);
    
    List<CaseEntity> findByOwner(String owner);
    
    List<CaseEntity> findByBank(String bank);
    
    @Query("SELECT c FROM CaseEntity c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:type IS NULL OR c.type = :type) AND " +
           "(:owner IS NULL OR c.owner = :owner) AND " +
           "(:bank IS NULL OR c.bank = :bank) AND " +
           "(:dateFrom IS NULL OR c.createdDate >= :dateFrom) AND " +
           "(:dateTo IS NULL OR c.createdDate <= :dateTo)")
    List<CaseEntity> findByFilters(@Param("status") CaseStatus status,
                                  @Param("type") String type,
                                  @Param("owner") String owner,
                                  @Param("bank") String bank,
                                  @Param("dateFrom") LocalDateTime dateFrom,
                                  @Param("dateTo") LocalDateTime dateTo);
    
    boolean existsByCaseId(String caseId);
}


