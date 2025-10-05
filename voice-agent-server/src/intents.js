// Intent definitions - can be auto-generated from repository analysis
export const INTENT_DEFINITIONS = {
  LIST_CASES_PENDING: {
    name: 'LIST_CASES_PENDING',
    description: 'Show cases with pending status',
    examples: ['show pending cases', 'list pending cases', 'show me pending cases'],
    entities: ['status'],
    confidence_threshold: 0.7
  },
  LIST_CASES_MINE: {
    name: 'LIST_CASES_MINE', 
    description: 'Show cases assigned to current user',
    examples: ['show my cases', 'list my cases', 'show cases assigned to me'],
    entities: ['assignedTo'],
    confidence_threshold: 0.7
  },
  FILTER_STATUS: {
    name: 'FILTER_STATUS',
    description: 'Filter cases by status',
    examples: ['filter by status open', 'show open cases', 'filter status pending'],
    entities: ['status'],
    confidence_threshold: 0.6
  },
  UPLOAD_FILE: {
    name: 'UPLOAD_FILE',
    description: 'Upload evidence or alert file',
    examples: ['upload file', 'upload evidence', 'upload excel file'],
    entities: ['fileType'],
    confidence_threshold: 0.8
  },
  EMAIL_BANK_FOR_CASE: {
    name: 'EMAIL_BANK_FOR_CASE',
    description: 'Send email to bank for specific case',
    examples: ['email bank for case 123', 'mail bank case MCC-CS-REC-P-251001-18783'],
    entities: ['caseId'],
    confidence_threshold: 0.8
  }
};

// Intent detection methods - can be swapped for ML models
export const INTENT_DETECTORS = {
  // Current regex-based detector
  regex: (text, intentDef) => {
    const patterns = {
      LIST_CASES_PENDING: /(show|list).*(pending|open).*cases/i,
      LIST_CASES_MINE: /(show|list).*(my).*cases/i,
      FILTER_STATUS: /(filter).*(status)\s*(\w+)/i,
      UPLOAD_FILE: /(upload).*(excel|file|evidence)/i,
      EMAIL_BANK_FOR_CASE: /(email|mail).*(bank).*(case)\s*([\w-]+)/i
    };
    const pattern = patterns[intentDef.name];
    return pattern ? pattern.test(text) : false;
  },
  
  // Future ML-based detector (placeholder)
  ml: async (text, intentDef) => {
    // TODO: Replace with actual ML model call
    // const model = await loadIntentModel();
    // const prediction = await model.predict(text);
    // return prediction.confidence > intentDef.confidence_threshold;
    return false;
  }
};

// Main intent detection function - can switch between methods
export function detectIntent(text, method = 'regex') {
  const detector = INTENT_DETECTORS[method];
  if (!detector) throw new Error(`Unknown intent detection method: ${method}`);
  
  const candidates = [];
  
  for (const [intentName, intentDef] of Object.entries(INTENT_DEFINITIONS)) {
    const matches = detector(text, intentDef);
    if (matches) {
      candidates.push({
        name: intentName,
        confidence: intentDef.confidence_threshold,
        definition: intentDef
      });
    }
  }
  
  // Return most confident intent
  if (candidates.length === 0) {
    return { name: 'UNKNOWN', confidence: 0.2 };
  }
  
  return candidates.sort((a, b) => b.confidence - a.confidence)[0];
}
