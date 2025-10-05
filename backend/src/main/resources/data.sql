-- Seed data for Case Management Demo
-- Based on UI images showing various case types and statuses

INSERT INTO cases (id, case_id, type, status, created_date, last_updated_date, owner, description, bank, fine_amount, notes, complainant_type, complainant_company, complainant_ica, complainant_country, complainant_region, acquirer_primary_ica, acquirer_country, acquirer_region, sub_program, overall_case_lead) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'MCC-CS-REC-P-251001-18783', 'MCC', 'NEW', '2025-01-01 10:30:00', '2025-01-03 14:20:00', '1234', 'Merchant Category Code miscoding case for Recovery program. Bank reported discrepancies in merchant categorization affecting transaction processing.', 'Banco do Brasil, S.A.', 15000.00, 'Initial case creation. Awaiting bank response for additional documentation.', 'Acquirer', 'Banco do Brasil, S.A. (129299)', '4348', 'BRAZIL', 'Latin America and the Caribbean', '4348', 'BRAZIL', 'Latin America and the Caribbean', 'RECOVERY', '1234'),

('550e8400-e29b-41d4-a716-446655440002', 'MCC-CS-PRO-A-251002-18784', 'MCC', 'ASSESSMENT', '2025-01-02 09:15:00', '2025-01-04 11:45:00', 'MCCGBS ANALYST', 'Proactive MCC miscoding detection case. Automated system flagged potential categorization issues.', 'Unibanco-Uniao de Bancos', 8500.00, 'Under assessment. Reviewing merchant transaction patterns and categorization logic.', 'Issuer', 'Unibanco-Uniao de Bancos (6630)', '6630', 'BRAZIL', 'Latin America and the Caribbean', '6630', 'BRAZIL', 'Latin America and the Caribbean', 'PROACTIVE', 'Gagan Chandra Das'),

('550e8400-e29b-41d4-a716-446655440003', 'MCC-CS-REA-R-251003-18785', 'MCC', 'OPEN', '2025-01-03 14:20:00', '2025-01-05 16:30:00', 'GBSC ANALYST', 'Reactive MCC case following bank complaint. Immediate investigation required.', 'Itau Unibanco S.A.', 22000.00, 'Case opened. Bank provided initial evidence package. Review in progress.', 'Acquirer', 'Itau Unibanco S.A. (8923)', '8923', 'BRAZIL', 'Latin America and the Caribbean', '8923', 'BRAZIL', 'Latin America and the Caribbean', 'REACTIVE', 'GBSC ANALYST'),

('550e8400-e29b-41d4-a716-446655440004', 'BRAM-CS-REC-P-251004-18786', 'BRAM', 'HOLD', '2025-01-04 11:30:00', '2025-01-06 09:15:00', 'MCCANALYST MCCANALYST', 'Business Risk Assessment and Monitoring case. Merchant compliance review required.', 'Santander Brasil S.A.', 12500.00, 'Case on hold pending additional merchant documentation. Awaiting compliance team review.', 'Acquirer', 'Santander Brasil S.A. (4567)', '4567', 'BRAZIL', 'Latin America and the Caribbean', '4567', 'BRAZIL', 'Latin America and the Caribbean', 'RECOVERY', 'MCCANALYST MCCANALYST'),

('550e8400-e29b-41d4-a716-446655440005', 'GRIP-CS-PRO-A-251005-18787', 'GRIP', 'PENDING', '2025-01-05 08:45:00', '2025-01-07 13:20:00', 'MCCGBS ANALYST', 'Global Risk Intelligence Platform case. Cross-border transaction monitoring alert.', 'Bradesco S.A.', 18000.00, 'Pending bank response. GRIP system detected unusual transaction patterns across multiple regions.', 'Issuer', 'Bradesco S.A. (237)', '237', 'BRAZIL', 'Latin America and the Caribbean', '237', 'BRAZIL', 'Latin America and the Caribbean', 'PROACTIVE', 'MCCGBS ANALYST'),

('550e8400-e29b-41d4-a716-446655440006', 'MATCH-CS-REA-R-251006-18788', 'MATCH', 'CLOSED', '2025-01-06 16:00:00', '2025-01-08 10:30:00', 'GBSC ANALYST', 'MATCH system case. Merchant terminated following investigation completion.', 'Caixa Economica Federal', 0.00, 'Case closed. MATCH entry completed. Merchant terminated from network. Documentation archived.', 'Acquirer', 'Caixa Economica Federal (104)', '104', 'BRAZIL', 'Latin America and the Caribbean', '104', 'BRAZIL', 'Latin America and the Caribbean', 'REACTIVE', 'GBSC ANALYST'),

('550e8400-e29b-41d4-a716-446655440007', 'MCC-CS-REC-P-251007-18789', 'MCC', 'OPEN', '2025-01-07 12:15:00', '2025-01-09 15:45:00', 'MCCANALYST MCCANALYST', 'Complex MCC miscoding case involving multiple merchant categories. Detailed investigation required.', 'HSBC Bank Brasil S.A.', 25000.00, 'Open case. Multiple category violations detected. Coordinating with regional teams for comprehensive review.', 'Acquirer', 'HSBC Bank Brasil S.A. (7890)', '7890', 'BRAZIL', 'Latin America and the Caribbean', '7890', 'BRAZIL', 'Latin America and the Caribbean', 'RECOVERY', 'MCCANALYST MCCANALYST');

-- Insert attachments for some cases
INSERT INTO case_attachments (case_id, attachment_filename) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Recovery_Issuer_Ex.xlsx'),
('550e8400-e29b-41d4-a716-446655440001', 'MCC_Compliance_Report.pdf'),
('550e8400-e29b-41d4-a716-446655440002', 'Reactive_ICA_External.xlsx'),
('550e8400-e29b-41d4-a716-446655440002', 'Proactive_Analysis_Doc.pdf'),
('550e8400-e29b-41d4-a716-446655440003', 'Transaction_Logs.xlsx'),
('550e8400-e29b-41d4-a716-446655440004', 'Compliance_Review.pdf'),
('550e8400-e29b-41d4-a716-446655440005', 'GRIP_Alert_Report.xlsx'),
('550e8400-e29b-41d4-a716-446655440006', 'MATCH_Termination_Notice.pdf'),
('550e8400-e29b-41d4-a716-446655440007', 'Multi_Category_Analysis.xlsx');



