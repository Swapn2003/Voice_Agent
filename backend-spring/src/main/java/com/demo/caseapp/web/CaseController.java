package com.demo.caseapp.web;

import com.demo.caseapp.model.CaseEntity;
import com.demo.caseapp.repo.CaseRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
@CrossOrigin
public class CaseController {
    private final CaseRepository repo;
    public CaseController(CaseRepository repo) { this.repo = repo; }

    @PostConstruct
    public void seed() {
        if (repo.count() == 0) {
            CaseEntity a = new CaseEntity(); a.setTitle("KYC Verification"); a.setStatus("pending"); a.setAssignedTo("analyst"); repo.save(a);
            CaseEntity b = new CaseEntity(); b.setTitle("Loan Approval"); b.setStatus("open"); b.setAssignedTo("analyst"); repo.save(b);
            CaseEntity c = new CaseEntity(); c.setTitle("Fraud Review"); c.setStatus("closed"); c.setAssignedTo("team"); repo.save(c);
        }
    }

    @GetMapping
    public List<CaseEntity> list() { return repo.findAll(); }

    @PostMapping("/{id}/email-bank")
    public ResponseEntity<String> emailBank(@PathVariable Long id) {
        // simulate email dispatch
        return ResponseEntity.ok("Email sent for case " + id);
    }
}


