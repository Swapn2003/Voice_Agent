// Plan mappings - can be auto-generated from repository analysis
export const PLAN_TEMPLATES = {
  LIST_CASES_PENDING: {
    intent: 'LIST_CASES_PENDING',
    description: 'Filter UI to show pending cases',
    steps: [
      {
        kind: 'ui',
        action: 'filter',
        target: 'status',
        value: 'pending',
        successMessage: 'Showing pending cases'
      }
    ]
  },
  
  LIST_CASES_MINE: {
    intent: 'LIST_CASES_MINE',
    description: 'Filter UI to show user\'s cases',
    steps: [
      {
        kind: 'ui',
        action: 'filter',
        target: 'assignedTo',
        value: 'me',
        successMessage: 'Showing your cases'
      }
    ]
  },
  
  FILTER_STATUS: {
    intent: 'FILTER_STATUS',
    description: 'Filter UI by status from entities',
    steps: [
      {
        kind: 'ui',
        action: 'filter',
        target: 'status',
        value: '{{entities.status}}',
        successMessage: 'Filtered status to {{entities.status}}'
      }
    ]
  },
  
  UPLOAD_FILE: {
    intent: 'UPLOAD_FILE',
    description: 'Trigger file upload UI',
    steps: [
      {
        kind: 'ui',
        action: 'upload',
        target: 'upload',
        value: { type: '{{entities.fileType}}' },
        successMessage: 'Ready to upload file'
      }
    ]
  },
  
  EMAIL_BANK_FOR_CASE: {
    intent: 'EMAIL_BANK_FOR_CASE',
    description: 'Send email to bank for specific case',
    steps: [
      {
        kind: 'api',
        method: 'POST',
        url: '{{context.caseApiBase}}/cases/{{entities.caseId}}/email-bank',
        successMessage: 'Emailed bank for case {{entities.caseId}}'
      }
    ]
  }
};

// Plan generation function - can be enhanced for complex multi-step plans
export function generatePlan(intent, entities, context) {
  const template = PLAN_TEMPLATES[intent.name];
  if (!template) {
    return [{ kind: 'noop', reason: "Can't perform an action for this intent" }];
  }
  
  // Deep clone the template steps
  const steps = JSON.parse(JSON.stringify(template.steps));
  
  // Replace template variables with actual values
  steps.forEach(step => {
    if (step.value && typeof step.value === 'string' && step.value.includes('{{')) {
      step.value = interpolateTemplate(step.value, { entities, context });
    }
    if (step.url && step.url.includes('{{')) {
      step.url = interpolateTemplate(step.url, { entities, context });
    }
    if (step.successMessage && step.successMessage.includes('{{')) {
      step.successMessage = interpolateTemplate(step.successMessage, { entities, context });
    }
  });
  
  return steps;
}

// Template interpolation helper
function interpolateTemplate(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.split('.');
    let value = data;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || match;
  });
}

// Future: Auto-generate plans from repository analysis
export function generatePlansFromRepos(backendRepo, frontendRepo) {
  // TODO: Analyze repositories and generate intent definitions and plan templates
  // This would involve:
  // 1. Scanning backend for API endpoints
  // 2. Scanning frontend for UI components and actions
  // 3. Creating intent definitions based on available functionality
  // 4. Creating plan templates that map intents to API calls and UI actions
  
  console.log('Auto-generating plans from repos:', { backendRepo, frontendRepo });
  return {
    intents: {},
    plans: {}
  };
}
