import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Use UI image: case-details.png for case details layout
// Based on the case details panel showing overview and initiation sections
const CaseDetails = ({ 
  case: caseItem, 
  onUpdate, 
  onEmailBank, 
  onUploadEvidence, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSave = async () => {
    try {
      await onUpdate(caseItem.caseId, editedData);
      setIsEditing(false);
      setEditedData({});
    } catch (error) {
      console.error('Error updating case:', error);
      alert('Error updating case');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const updatedNotes = caseItem.notes ? 
          `${caseItem.notes}\n\n${new Date().toLocaleString()}: ${newNote}` : 
          `${new Date().toLocaleString()}: ${newNote}`;
        
        await onUpdate(caseItem.caseId, { notes: updatedNotes });
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
        alert('Error adding note');
      }
    }
  };

  const handleMarkResolved = async () => {
    if (window.confirm('Are you sure you want to mark this case as resolved?')) {
      try {
        await onUpdate(caseItem.caseId, { status: 'CLOSED' });
      } catch (error) {
        console.error('Error marking case as resolved:', error);
        alert('Error marking case as resolved');
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUploadEvidence(caseItem.caseId, file);
      event.target.value = '';
    }
  };

  if (!caseItem) {
    return (
      <div className="case-details-modal">
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Case Not Found</h2>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <p>The requested case could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'investigation', label: 'Investigation' },
    { id: 'determination', label: 'Determination' },
    { id: 'mitigation', label: 'Mitigation & Resolution' },
    { id: 'comments', label: 'Comments' },
    { id: 'attachments', label: 'Attachments' },
    { id: 'communications', label: 'Communications' },
    { id: 'history', label: 'History' }
  ];

  return (
    <div className="case-details-modal">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <Link to="/" className="breadcrumb">← Customer Case List</Link>
            <div className="header-actions">
              <button 
                className="header-btn save-btn"
                onClick={handleSave}
                disabled={!isEditing}
              >
                Save
              </button>
              <button 
                className="header-btn assign-btn"
                onClick={() => alert('Assign functionality')}
              >
                Assign
              </button>
              <button 
                className="header-btn close-btn"
                onClick={handleMarkResolved}
              >
                Case Close
              </button>
            </div>
          </div>

          <div className="case-details-content">
            <h1 className="case-title">
              Customer Case Details - {caseItem.complainantType || 'Acquirer'}
            </h1>

            <div className="case-details-layout">
              <div className="case-details-nav">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="case-details-main">
                {activeTab === 'overview' && (
                  <div className="details-section">
                    <div className="section-header">
                      <h3>OVERVIEW</h3>
                      <div className="status-display">
                        Status: <span className="status-value">{caseItem.status}</span>
                      </div>
                    </div>

                    <div className="details-grid">
                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Case ID:</label>
                          <span className="detail-value case-id">{caseItem.caseId}</span>
                        </div>
                        <div className="detail-item">
                          <label>Case Owner:</label>
                          <span className="detail-value">{caseItem.owner}</span>
                        </div>
                        <div className="detail-item">
                          <label>Overall Case Lead:</label>
                          <span className="detail-value">
                            {isEditing ? (
                              <input 
                                type="text"
                                value={editedData.overallCaseLead || caseItem.overallCaseLead || ''}
                                onChange={(e) => setEditedData({...editedData, overallCaseLead: e.target.value})}
                                className="edit-input"
                              />
                            ) : (
                              <span className="dropdown-field">
                                {caseItem.overallCaseLead || 'MCCANALYST MCCAN...X'}
                                <span className="dropdown-arrow">▼</span>
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="detail-item">
                          <label>Sub Program:</label>
                          <span className="detail-value">{caseItem.subProgram || 'RECOVERY'}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Acquirer Company Name (CID):</label>
                          <span className="detail-value company-name">{caseItem.bank}</span>
                        </div>
                        <div className="detail-item">
                          <label>Acquirer Primary ICA:</label>
                          <span className="detail-value">{caseItem.acquirerPrimaryIca || '4348'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Acquirer Country:</label>
                          <span className="detail-value">{caseItem.acquirerCountry || 'BRAZIL'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Acquirer Region:</label>
                          <span className="detail-value">{caseItem.acquirerRegion || 'Latin America and the Caribbean'}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Complainant Type:</label>
                          <span className="detail-value">{caseItem.complainantType || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Complainant Company Name (CID):</label>
                          <span className="detail-value company-name">{caseItem.complainantCompany || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Complainant ICA:</label>
                          <span className="detail-value">{caseItem.complainantIca || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Complainant Country:</label>
                          <span className="detail-value">{caseItem.complainantCountry || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Complainant Region:</label>
                          <span className="detail-value">{caseItem.complainantRegion || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="detail-row">
                        <div className="detail-item">
                          <label>Created By:</label>
                          <span className="detail-value">{caseItem.owner}</span>
                        </div>
                        <div className="detail-item">
                          <label>Created Date:</label>
                          <span className="detail-value">{formatDate(caseItem.createdDate)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Last Updated By:</label>
                          <span className="detail-value">{caseItem.owner}</span>
                        </div>
                        <div className="detail-item">
                          <label>Last Updated Date:</label>
                          <span className="detail-value">{formatDateTime(caseItem.lastUpdatedDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="merchants-section">
                      <div className="merchants-header">
                        <span className="merchants-icon">👥</span>
                        <span className="merchants-label">Merchants (5)</span>
                      </div>
                      <div className="merchants-stats">
                        <div className="merchant-stat">
                          <span className="stat-label">New:</span>
                          <span className="stat-value">5</span>
                        </div>
                        <div className="merchant-stat">
                          <span className="stat-label">Open:</span>
                          <span className="stat-value">0</span>
                        </div>
                        <div className="merchant-stat">
                          <span className="stat-label">Closed:</span>
                          <span className="stat-value">0</span>
                        </div>
                      </div>
                    </div>

                    <div className="initiation-section">
                      <h3>INITIATION</h3>
                      <div className="detail-item">
                        <label>Alert ID (5):</label>
                        <span className="detail-value">Alert-{caseItem.caseId.split('-').pop()}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="details-section">
                    <h3>COMMENTS & NOTES</h3>
                    <div className="notes-section">
                      <div className="existing-notes">
                        <h4>Existing Notes:</h4>
                        <div className="notes-content">
                          {caseItem.notes ? (
                            <pre className="notes-text">{caseItem.notes}</pre>
                          ) : (
                            <p className="no-notes">No notes available for this case.</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="add-note-section">
                        <h4>Add New Note:</h4>
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note here..."
                          className="note-textarea"
                          rows="4"
                        />
                        <button 
                          className="add-note-btn"
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                        >
                          Add Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && (
                  <div className="details-section">
                    <h3>ATTACHMENTS</h3>
                    <div className="attachments-section">
                      <div className="existing-attachments">
                        <h4>Current Attachments:</h4>
                        {caseItem.attachments && caseItem.attachments.length > 0 ? (
                          <ul className="attachments-list">
                            {caseItem.attachments.map((attachment, index) => (
                              <li key={index} className="attachment-item">
                                <span className="attachment-name">{attachment}</span>
                                <button className="download-btn">Download</button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-attachments">No attachments available for this case.</p>
                        )}
                      </div>
                      
                      <div className="upload-section">
                        <h4>Upload New Evidence:</h4>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.jpeg,.png"
                          className="file-input"
                        />
                        <button 
                          className="upload-btn"
                          onClick={() => document.querySelector('.file-input').click()}
                        >
                          Choose File
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="details-section">
                    <h3>CASE HISTORY</h3>
                    <div className="history-section">
                      <div className="history-item">
                        <span className="history-date">{formatDateTime(caseItem.createdDate)}</span>
                        <span className="history-action">Case Created</span>
                        <span className="history-user">by {caseItem.owner}</span>
                      </div>
                      {caseItem.lastUpdatedDate && caseItem.lastUpdatedDate !== caseItem.createdDate && (
                        <div className="history-item">
                          <span className="history-date">{formatDateTime(caseItem.lastUpdatedDate)}</span>
                          <span className="history-action">Case Updated</span>
                          <span className="history-user">by {caseItem.owner}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="case-actions">
              <button 
                className="action-btn edit-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel Edit' : 'Edit Case'}
              </button>
              <button 
                className="action-btn email-btn"
                onClick={() => onEmailBank(caseItem.caseId)}
              >
                Email Bank
              </button>
              <button 
                className="action-btn resolve-btn"
                onClick={handleMarkResolved}
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;


