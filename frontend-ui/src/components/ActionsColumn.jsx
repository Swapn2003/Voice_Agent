import React, { useRef } from 'react';

// Actions column component with View Details, Email Bank, and Upload Evidence buttons
const ActionsColumn = ({ 
  caseId, 
  onViewDetails, 
  onEmailBank, 
  onUploadEvidence 
}) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadEvidence(file);
      // Reset the input
      event.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="actions-column">
      <button 
        className="action-btn view-details-btn"
        onClick={onViewDetails}
        title="View Case Details"
      >
        View Details
      </button>
      
      <button 
        className="action-btn email-bank-btn"
        onClick={onEmailBank}
        title="Email Bank"
      >
        Email Bank
      </button>
      
      <button 
        className="action-btn upload-evidence-btn"
        onClick={triggerFileUpload}
        title="Upload Evidence"
      >
        Upload Evidence
      </button>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
      />
    </div>
  );
};

export default ActionsColumn;



