// import { useState, useEffect } from 'react';

// // Voice Integration Hook - Placeholder for voice overlay integration
// // This hook provides a clear API for the voice overlay to interact with the case management app
// const VoiceIntegrationHook = ({
//   cases,
//   setCases,
//   selectedCase,
//   setSelectedCase,
//   showCaseDetails,
//   setShowCaseDetails,
//   filters,
//   setFilters
// }) => {
//   const [voiceCommands, setVoiceCommands] = useState([]);
//   const [isListening, setIsListening] = useState(false);

//   // Voice command handlers
//   const voiceHandlers = {
//     // Select and highlight a specific case
//     selectCase: (caseId) => {
//       console.log(`Voice Command: Selecting case ${caseId}`);
//       const caseToSelect = cases.find(c => c.caseId === caseId);
//       if (caseToSelect) {
//         setSelectedCase(caseToSelect);
//         setShowCaseDetails(true);
//         // Highlight the case in the table (would need to implement visual highlighting)
//         return { success: true, message: `Case ${caseId} selected and details opened` };
//       }
//       return { success: false, message: `Case ${caseId} not found` };
//     },

//     // Apply filters to the case list
//     filterCases: (filterOptions) => {
//       console.log('Voice Command: Applying filters', filterOptions);
//       setFilters(prev => ({ ...prev, ...filterOptions }));
//       return { success: true, message: 'Filters applied successfully' };
//     },

//     // Filter by specific status
//     filterByStatus: (status) => {
//       console.log(`Voice Command: Filtering by status ${status}`);
//       setFilters(prev => ({ ...prev, status: status.toUpperCase() }));
//       return { success: true, message: `Filtered by status: ${status}` };
//     },

//     // Filter by case type
//     filterByType: (type) => {
//       console.log(`Voice Command: Filtering by type ${type}`);
//       setFilters(prev => ({ ...prev, type: type.toUpperCase() }));
//       return { success: true, message: `Filtered by type: ${type}` };
//     },

//     // Clear all filters
//     clearFilters: () => {
//       console.log('Voice Command: Clearing all filters');
//       setFilters({});
//       return { success: true, message: 'All filters cleared' };
//     },

//     // Show all cases
//     showAllCases: () => {
//       console.log('Voice Command: Showing all cases');
//       setFilters({});
//       setShowCaseDetails(false);
//       return { success: true, message: 'Showing all cases' };
//     },

//     // Close case details
//     closeCaseDetails: () => {
//       console.log('Voice Command: Closing case details');
//       setShowCaseDetails(false);
//       setSelectedCase(null);
//       return { success: true, message: 'Case details closed' };
//     },

//     // Get case summary
//     getCaseSummary: (caseId) => {
//       console.log(`Voice Command: Getting summary for case ${caseId}`);
//       const caseToSummarize = cases.find(c => c.caseId === caseId);
//       if (caseToSummarize) {
//         const summary = {
//           caseId: caseToSummarize.caseId,
//           type: caseToSummarize.type,
//           status: caseToSummarize.status,
//           bank: caseToSummarize.bank,
//           owner: caseToSummarize.owner,
//           fineAmount: caseToSummarize.fineAmount,
//           createdDate: caseToSummarize.createdDate
//         };
//         return { success: true, data: summary, message: `Case ${caseId} summary retrieved` };
//       }
//       return { success: false, message: `Case ${caseId} not found` };
//     },

//     // Get statistics
//     getStatistics: () => {
//       console.log('Voice Command: Getting case statistics');
//       const stats = {
//         total: cases.length,
//         byStatus: cases.reduce((acc, c) => {
//           acc[c.status] = (acc[c.status] || 0) + 1;
//           return acc;
//         }, {}),
//         byType: cases.reduce((acc, c) => {
//           acc[c.type] = (acc[c.type] || 0) + 1;
//           return acc;
//         }, {}),
//         totalFineAmount: cases.reduce((sum, c) => sum + (c.fineAmount || 0), 0)
//       };
//       return { success: true, data: stats, message: 'Statistics retrieved' };
//     }
//   };

//   // Process voice command
//   const processVoiceCommand = (command, params = {}) => {
//     const handler = voiceHandlers[command];
//     if (handler) {
//       const result = handler(params);
//       setVoiceCommands(prev => [...prev, {
//         id: Date.now(),
//         command,
//         params,
//         result,
//         timestamp: new Date().toISOString()
//       }]);
//       return result;
//     }
//     return { success: false, message: `Unknown command: ${command}` };
//   };

//   // Voice overlay integration methods
//   const voiceIntegration = {
//     // Main command processor
//     executeCommand: processVoiceCommand,

//     // Individual command methods for direct access
//     selectCase: (caseId) => processVoiceCommand('selectCase', caseId),
//     filterCases: (filterOptions) => processVoiceCommand('filterCases', filterOptions),
//     filterByStatus: (status) => processVoiceCommand('filterByStatus', status),
//     filterByType: (type) => processVoiceCommand('filterByType', type),
//     clearFilters: () => processVoiceCommand('clearFilters'),
//     showAllCases: () => processVoiceCommand('showAllCases'),
//     closeCaseDetails: () => processVoiceCommand('closeCaseDetails'),
//     getCaseSummary: (caseId) => processVoiceCommand('getCaseSummary', caseId),
//     getStatistics: () => processVoiceCommand('getStatistics'),

//     // State accessors for voice overlay
//     getCurrentState: () => ({
//       totalCases: cases.length,
//       filteredCases: cases.length, // Would need to calculate based on current filters
//       selectedCase: selectedCase?.caseId || null,
//       showCaseDetails,
//       currentFilters: filters,
//       isListening
//     }),

//     // Command history
//     getCommandHistory: () => voiceCommands,
//     clearCommandHistory: () => setVoiceCommands([]),

//     // Listening state management
//     setIsListening,
//     isListening,

//     // Available commands for help/autocomplete
//     getAvailableCommands: () => [
//       'selectCase',
//       'filterCases', 
//       'filterByStatus',
//       'filterByType',
//       'clearFilters',
//       'showAllCases',
//       'closeCaseDetails',
//       'getCaseSummary',
//       'getStatistics'
//     ],

//     // Sample voice commands for demo
//     getSampleCommands: () => [
//       'Show me all cases',
//       'Filter by status NEW',
//       'Filter by type MCC',
//       'Clear all filters',
//       'Open case MCC-CS-REC-P-251001-18783',
//       'Get summary for case MCC-CS-REC-P-251001-18783',
//       'Show statistics',
//       'Close case details'
//     ]
//   };

//   // Make voice integration available globally for voice overlay
//   useEffect(() => {
//     window.caseManagementVoiceIntegration = voiceIntegration;
//     console.log('Voice integration hook initialized and available at window.caseManagementVoiceIntegration');
//   }, [voiceIntegration]);

//   return voiceIntegration;
// };

// export default VoiceIntegrationHook;



