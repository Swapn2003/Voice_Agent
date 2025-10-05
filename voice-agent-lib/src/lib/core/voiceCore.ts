import { useCallback } from 'react';
import create from 'zustand';
import axios from 'axios';
import { detectWakeWord, startSTT, stopSTT, speakText } from '../speech/speech';
import { type Plan } from './planner/actionPlanner';
import { performUIAction } from './ui/uiController';
import { updateHeuristics } from './learning/learning';

export type VoiceCoreState = {
  isRecording: boolean;
  liveTranscript: string;
  feedbackMessage: string;
  context: any | null;
  recentHistory: Array<{ command: string; result: string }>;
};

type VoiceCoreActions = {
  setRecording: (rec: boolean) => void;
  setTranscript: (t: string) => void;
  setFeedback: (f: string) => void;
  setContext: (c: any) => void;
  pushHistory: (h: { command: string; result: string }) => void;
};

const useStore = create<VoiceCoreState & VoiceCoreActions>((set) => ({
  isRecording: false,
  liveTranscript: '',
  feedbackMessage: '',
  context: null,
  recentHistory: [],
  setRecording: (isRecording) => set({ isRecording }),
  setTranscript: (liveTranscript) => set({ liveTranscript }),
  setFeedback: (feedbackMessage) => set({ feedbackMessage }),
  setContext: (context) => set({ context }),
  pushHistory: (h) => set((s) => ({ recentHistory: [h, ...s.recentHistory].slice(0, 10) }))
}));

export function useVoiceCore(appId: string) {
  const state = useStore();

  const loadContext = useCallback(async () => {
    try {
      const res = await axios.get(`/voice-agent/context/${appId}`);
      console.log('[VA][context] loaded', res.data);
      const s = useStore.getState();
      s.setContext(res.data);
      s.setFeedback('Voice Agent ready. Say a command.');
    } catch (e) {
      const s = useStore.getState();
      s.setFeedback('Failed to load voice context');
    }
  }, [appId]);

  const speak = useCallback((text: string) => {
    speakText(text);
  }, []);

  const handleFinalTranscript = useCallback(async (text: string) => {
    state.setTranscript(text);
    if (!text.trim()) return;
    const plan = await fetchServerPlan({ text, appId });
    let resultMsg = 'Action completed';
    try {
      resultMsg = await executePlan(plan);
      updateHeuristics({ text, plan, success: true });
    } catch (err: any) {
      resultMsg = `Failed: ${err?.message || 'Unknown error'}`;
      updateHeuristics({ text, plan, success: false });
    } finally {
      state.setFeedback(resultMsg);
      // Speak immediately to ensure audible feedback even if UI component effect doesn't run
      speakText(resultMsg);
      state.pushHistory({ command: text, result: resultMsg });
    }
  }, [state]);

  async function executePlan(plan: Plan): Promise<string> {
    if (!plan || plan.length === 0) return 'No action to perform';
    let lastMsg = '';
    for (const step of plan) {
      if (step.kind === 'ui') {
        lastMsg = await performUIAction(step as any);
      } else if (step.kind === 'api') {
        const s = step as any;
        const apiRes = await axios({ method: s.method || 'GET', url: s.url, headers: s.headers, data: s.body });
        lastMsg = s.successMessage || `Done: ${apiRes.status}`;
      } else if (step.kind === 'noop') {
        lastMsg = (step as any).reason || 'No operation';
      }
    }
    return lastMsg || 'Action completed';
  }

  const startListening = useCallback(async () => {
    if (state.isRecording) return;
    state.setRecording(true);
    startSTT({
      onResult: (partial) => state.setTranscript(partial),
      onFinal: handleFinalTranscript,
      onEnd: () => state.setRecording(false)
    });
  }, [handleFinalTranscript, state]);

  const stopListening = useCallback(() => {
    stopSTT();
    state.setRecording(false);
  }, [state]);

  return { state, loadContext, startListening, stopListening, speak };
}

async function fetchServerPlan({ text, appId }: { text: string; appId: string }): Promise<Plan> {
  const base = getVoiceAgentBase();
  const params = new URLSearchParams({ text, appId });
  const res = await fetch(`${base}/plan?${params.toString()}`);
  console.log('url:', `${base}/plan?${params.toString()}`);
  const data = await res.json();
  return data?.plan || [];
}

function getVoiceAgentBase(): string {
  const w: any = window as any;
  // Precedence: window override → env → hard dev default (8081) → proxy fallback
  return (
    w.__VOICE_AGENT_BASE__ ||
    'http://localhost:8081/voice-agent' ||
    '/voice-agent'
  );
}


