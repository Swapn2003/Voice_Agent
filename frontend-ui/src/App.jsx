import React, { useState, useEffect } from 'react';
import { VoiceAgent } from 'voice-agent-lib';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CaseTable from './components/CaseTable';
import CaseDetails from './components/CaseDetails';
import { CaseService } from './api/api';

// Demo Mode Banner Component
const DemoModeBanner = () => (
  <div style={{
    backgroundColor: '#ff6b35',
    color: 'white',
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold'
  }}>
    🎤 DEMO MODE - Voice Commands Available: "Show me all cases", "Filter by status NEW", "Open case MCC-CS-REC-P-251001-18783", "Email bank for case", "Upload evidence"
  </div>
);

function App() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});


  useEffect(() => {
    loadCases();
  }, [filters]);

  const loadCases = async () => {
    try {
      setLoading(true);
      const casesData = await CaseService.getCases(filters);
      setCases(casesData);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCases = () => {
    loadCases();
  };

  const handleCaseSelect = async (caseId) => {
    try {
      const caseData = await CaseService.getCase(caseId);
      setSelectedCase(caseData);
      setShowCaseDetails(true);
    } catch (error) {
      console.error('Error loading case details:', error);
    }
  };

  const handleCaseUpdate = async (caseId, updatedData) => {
    try {
      const updatedCase = await CaseService.updateCase(caseId, updatedData);
      setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
      if (selectedCase && selectedCase.id === updatedCase.id) {
        setSelectedCase(updatedCase);
      }
    } catch (error) {
      console.error('Error updating case:', error);
    }
  };

  const handleEmailBank = async (caseId) => {
    try {
      const result = await CaseService.emailBank(caseId);
      alert(result.message);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email to bank');
    }
  };

  const handleUploadEvidence = async (caseId, file) => {
    try {
      const result = await CaseService.uploadEvidence(caseId, file);
      alert(`File uploaded successfully: ${result.filename}`);
      // Reload case details to show new attachment
      if (selectedCase && selectedCase.caseId === caseId) {
        const updatedCase = await CaseService.getCase(caseId);
        setSelectedCase(updatedCase);
      }
    } catch (error) {
      console.error('Error uploading evidence:', error);
      alert('Error uploading evidence');
    }
  };

  return (
    <Router>
      <div className="App">
        <DemoModeBanner />
        <Header />
        
        <Routes>
          <Route path="/" element={
            <div className="main-content">
              <CaseTable 
                cases={cases}
                loading={loading}
                onCaseSelect={handleCaseSelect}
                onEmailBank={handleEmailBank}
                onUploadEvidence={handleUploadEvidence}
                filters={filters}
                setFilters={setFilters}
                onRefreshCases={refreshCases}
              />
            </div>
          } />
          
          <Route path="/cases/:caseId" element={
            <div className="main-content">
              <CaseDetails 
                case={selectedCase}
                onUpdate={handleCaseUpdate}
                onEmailBank={handleEmailBank}
                onUploadEvidence={handleUploadEvidence}
              />
            </div>
          } />
        </Routes>

        {showCaseDetails && selectedCase && (
          <CaseDetails 
            case={selectedCase}
            onUpdate={handleCaseUpdate}
            onEmailBank={handleEmailBank}
            onUploadEvidence={handleUploadEvidence}
            onClose={() => setShowCaseDetails(false)}
          />
        )}
        <VoiceAgent appId="demoApp" />
      </div>
    </Router>
  );
}

export default App;



