import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FilterBar from './FilterBar';
import ActionsColumn from './ActionsColumn';
import { CaseService } from '../api/api';

// Use UI image: case-list.png for table layout
// Based on the case list table with columns: Case ID, Type, Status, Created Date, Actions
const CaseTable = ({ 
  cases, 
  loading, 
  onCaseSelect, 
  onEmailBank, 
  onUploadEvidence, 
  filters, 
  setFilters,
  onRefreshCases
}) => {
  const [selectedCases, setSelectedCases] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'NEW': 'status-badge new',
      'OPEN': 'status-badge open',
      'PENDING': 'status-badge pending',
      'ASSESSMENT': 'status-badge assessment',
      'HOLD': 'status-badge hold',
      'CLOSED': 'status-badge closed'
    };
    return statusClasses[status] || 'status-badge';
  };

  const handleSelectCase = (caseId) => {
    const newSelected = new Set(selectedCases);
    if (newSelected.has(caseId)) {
      newSelected.delete(caseId);
    } else {
      newSelected.add(caseId);
    }
    setSelectedCases(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCases.size === cases.length) {
      setSelectedCases(new Set());
    } else {
      setSelectedCases(new Set(cases.map(c => c.caseId)));
    }
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  const handleAssign = () => {
    alert('Assign functionality would be implemented here');
  };

  const handleBatchActions = () => {
    alert('Batch actions functionality would be implemented here');
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel' || 
          file.type === 'text/csv') {
        handleFileUpload(file);
      } else {
        alert('Please upload a valid Excel or CSV file');
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const processUploadedFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // Send file to backend for processing
      const response = await CaseService.uploadAlertFile(uploadedFile);
      
      console.log('File processed successfully:', response);
      
      // Show success message
      alert(`Successfully created ${response.casesCreated} cases from ${response.filename}`);
      
      // Close modal and reset state
      setShowUploadModal(false);
      setUploadedFile(null);
      
      // Refresh the cases list to show the new cases
      if (onRefreshCases) {
        onRefreshCases();
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Error processing file: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };


  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCases = cases.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cases.length / itemsPerPage);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="page-header-left">
          <Link to="/" className="breadcrumb">← Customer Case List</Link>
          <h1 className="page-title">Customer Case List</h1>
        </div>
        <div className="page-header-right">
          <button 
            className="upload-alert-btn"
            onClick={() => setShowUploadModal(true)}
          >
            Upload Alert
          </button>
        </div>
      </div>

      <div className="sub-nav">
        <button 
          className={`sub-nav-tab ${filters.subProgram === 'RECOVERY' ? 'active' : ''}`}
          onClick={() => setFilters({...filters, subProgram: 'RECOVERY'})}
        >
          Recovery
        </button>
        <button 
          className={`sub-nav-tab ${filters.subProgram === 'PROACTIVE' ? 'active' : ''}`}
          onClick={() => setFilters({...filters, subProgram: 'PROACTIVE'})}
        >
          Proactive
        </button>
        <button 
          className={`sub-nav-tab ${filters.subProgram === 'REACTIVE' ? 'active' : ''}`}
          onClick={() => setFilters({...filters, subProgram: 'REACTIVE'})}
        >
          Reactive
        </button>
      </div>

      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        onExport={handleExport}
        onAssign={handleAssign}
        onBatchActions={handleBatchActions}
      />

      <div className="table-container">
        <table className="cases-table" data-cases-table="true">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  checked={selectedCases.size === cases.length && cases.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Case ID <span className="column-icon">⋮</span></th>
              <th>Merchants <span className="column-icon">⋮</span></th>
              <th>Acquirer Primary ICA <span className="column-icon">⋮</span></th>
              <th>Acquirer Country <span className="column-icon">⋮</span></th>
              <th>Acquirer Company Name (CID) <span className="column-icon">⋮</span></th>
              <th>Overall Case Lead <span className="column-icon">⋮</span></th>
              <th>Case Owner <span className="column-icon">⋮</span></th>
              <th>Complainant Type <span className="column-icon">⋮</span></th>
              <th>Case Status <span className="column-icon">⋮</span></th>
              <th>Created By <span className="column-icon">⋮</span></th>
            </tr>
          </thead>
          <tbody>
            {currentCases.map((caseItem) => (
              <tr key={caseItem.id} className="case-row">
                <td>
                  <input 
                    type="checkbox"
                    checked={selectedCases.has(caseItem.caseId)}
                    onChange={() => handleSelectCase(caseItem.caseId)}
                  />
                </td>
                <td>
                  <Link 
                    to={`/cases/${caseItem.caseId}`}
                    className="case-id-link"
                    onClick={() => onCaseSelect(caseItem.caseId)}
                  >
                    {caseItem.caseId}
                  </Link>
                </td>
                <td>
                  <button className="view-merchants-btn" onClick={() => onCaseSelect(caseItem.caseId)}>
                    View
                  </button>
                </td>
                <td>{caseItem.acquirerPrimaryIca || 'N/A'}</td>
                <td>{caseItem.acquirerCountry || 'N/A'}</td>
                <td className="company-name">{caseItem.bank}</td>
                <td>{caseItem.overallCaseLead || 'N/A'}</td>
                <td>{caseItem.owner}</td>
                <td>{caseItem.complainantType || 'N/A'}</td>
                <td>
                  <span className={getStatusBadgeClass(caseItem.status)}>
                    {caseItem.status}
                  </span>
                </td>
                <td>{formatDate(caseItem.createdDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="pagination-info">
          <span>
            Displaying ({indexOfFirstItem + 1}-{Math.min(indexOfLastItem, cases.length)} of {cases.length})
          </span>
        </div>
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ««
          </button>
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            «
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            »
          </button>
          <button 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            »»
          </button>
        </div>
        <div className="pagination-size">
          <select 
            value={itemsPerPage} 
            onChange={(e) => {
              setCurrentPage(1);
              // In a real app, this would update itemsPerPage state
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Upload Alert Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="upload-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="upload-modal-header">
              <h2>Upload Alert</h2>
              <button 
                className="close-modal-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="upload-modal-body">
              <div className="upload-section">
                <h3>Upload Alert File</h3>
                <div 
                  className={`file-upload-area ${uploadedFile ? 'file-uploaded' : ''}`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="alert-file-upload"
                    accept=".xlsx,.xls,.csv"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                  <label htmlFor="alert-file-upload" className="file-upload-label">
                    {uploadedFile ? (
                      <div className="uploaded-file-info">
                        <div className="upload-icon">✅</div>
                        <div className="upload-text">
                          <p><strong>File uploaded:</strong> {uploadedFile.name}</p>
                          <p className="upload-hint">Size: {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                          <button 
                            type="button"
                            className="remove-file-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              setUploadedFile(null);
                            }}
                          >
                            Remove file
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📁</div>
                        <div className="upload-text">
                          <p>Click to browse or drag and drop your file here</p>
                          <p className="upload-hint">Supported formats: .xlsx, .xls, .csv</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="template-section">
                <h3>Download Template</h3>
                <div className="template-options">
                  <button className="template-btn">
                    <span className="template-icon">📄</span>
                    Recovery Issuer External.xlsx
                  </button>
                  <button className="template-btn">
                    <span className="template-icon">📄</span>
                    Reactive ICA External.xlsx
                  </button>
                  <button className="template-btn">
                    <span className="template-icon">📄</span>
                    Proactive Analysis Doc.pdf
                  </button>
                </div>
              </div>

              <div className="upload-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="upload-btn"
                  onClick={processUploadedFile}
                  disabled={!uploadedFile || isUploading}
                >
                  {isUploading ? 'Processing...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseTable;


