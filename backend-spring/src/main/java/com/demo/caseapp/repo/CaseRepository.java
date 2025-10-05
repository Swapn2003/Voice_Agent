package com.demo.caseapp.repo;

import com.demo.caseapp.model.CaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseRepository extends JpaRepository<CaseEntity, Long> { }


