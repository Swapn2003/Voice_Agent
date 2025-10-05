import axios from 'axios';

export function updateHeuristics(payload: { text: string; plan: any; success: boolean }) {
  try {
    void axios.post('/voice-agent/telemetry', payload);
  } catch {
    // ignore errors
  }
}


