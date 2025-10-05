type STTHandlers = {
  onResult: (partial: string) => void;
  onFinal: (text: string) => void;
  onEnd: () => void;
};

let recognition: any | null = null;
let finalizeTimer: number | null = null;
let lastInterim: string = '';

export function startSTT(handlers: STTHandlers) {
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  if (!SpeechRecognition) {
    handlers.onFinal('');
    handlers.onEnd();
    return;
  }
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += transcript;
      else interim += transcript;
    }
    if (interim) {
      lastInterim = interim;
      handlers.onResult(interim);
      // Debounce a fallback finalization in case the browser never emits isFinal
      if (finalizeTimer) clearTimeout(finalizeTimer);
      finalizeTimer = window.setTimeout(() => {
        if (lastInterim) {
          handlers.onFinal(lastInterim.trim());
          lastInterim = '';
        }
      }, 1200);
    }
    if (final) {
      if (finalizeTimer) clearTimeout(finalizeTimer);
      lastInterim = '';
      handlers.onFinal(final.trim());
    }
  };
  recognition.onend = () => handlers.onEnd();
  recognition.start();
}

export function stopSTT() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

export function speakText(text: string) {
  if (!text) return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    waitForVoices().then(() => {
      const voices = getLoadedVoices();
      // Clear any queued utterances to avoid overlapping
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 1.0;
      const preferred = voices.find(v => /en-US/i.test(v.lang) && /Google|Microsoft|Apple/i.test(v.name)) || voices.find(v => /en/i.test(v.lang)) || voices[0];
      if (preferred) utter.voice = preferred;
      synth.speak(utter);
    });
  } catch {
    // ignore
  }
}

export function detectWakeWord(_cb: () => void) {
  return () => {};
}

function getLoadedVoices(): SpeechSynthesisVoice[] {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (voices && voices.length > 0) return voices;
  // Attempt a synchronous nudge
  synth.cancel();
  voices = synth.getVoices();
  return voices || [];
}

export function resumeTTSIfNeeded() {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    // Chrome sometimes requires a user gesture to start/resume
    if ((synth as any).paused) synth.resume();
    // Nudge voices to load
    void synth.getVoices();
  } catch {
    // ignore
  }
}

function waitForVoices(): Promise<void> {
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve();
  const existing = synth.getVoices();
  if (existing && existing.length > 0) return Promise.resolve();
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(), 1000);
    const onVoices = () => { clearTimeout(timeout); synth.removeEventListener('voiceschanged', onVoices as any); resolve(); };
    synth.addEventListener('voiceschanged', onVoices as any);
    // nudge
    synth.cancel();
  });
}


