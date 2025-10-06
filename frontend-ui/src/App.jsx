import React, { useState, useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import { setCriteria } from './store/filtersSlice';
import { listFilterThunk } from './store/casesSlice';
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

function AppInner() {
  const dispatch = useDispatch();
  const cases = useSelector((s) => s.cases.items);
  const loading = useSelector((s) => s.cases.loading);
  const criteria = useSelector((s) => s.filters.criteria);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseDetails, setShowCaseDetails] = useState(false);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    dispatch(listFilterThunk());
  }, [dispatch]);

  // React to UI filter changes by mapping to backend-supported criteria and fetching
  useEffect(() => {
    const newCriteria = [];
    if (filters.status) {
      newCriteria.push({ field: 'CASESTATUS', operator: 'EQUAL_TO', value: filters.status });
    }
    if (filters.owner) {
      newCriteria.push({ field: 'ASSIGNTONAME', operator: 'CONTAINS', value: filters.owner });
    }
    if (filters.bank) {
      newCriteria.push({ field: 'COMPLAINANTCOMPANYNAME', operator: 'CONTAINS', value: filters.bank });
    }
    // Note: dateFrom/dateTo and type are not supported by backend search in this demo

    dispatch(setCriteria(newCriteria));
  }, [dispatch, filters]);

  // React to Redux criteria changes (e.g., from VoiceAgent) by fetching cases
  useEffect(() => {
    dispatch(listFilterThunk());
  }, [dispatch, criteria]);

  const refreshCases = () => { dispatch(listFilterThunk()); };

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
      // Refresh cases list via thunk to keep Redux state consistent
      dispatch(listFilterThunk());
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
        <VoiceAgent appId="demoApp" store={store} />
      </div>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;



