import React from 'react';
import ReactDOM from 'react-dom';
import { useVoiceCore } from './core/voiceCore';
import { resumeTTSIfNeeded } from './speech/speech';

export type VoiceAgentProps = { appId: string };

export const VoiceAgent: React.FC<VoiceAgentProps> = ({ appId }: VoiceAgentProps) => {
  const { state, startListening, stopListening, speak, loadContext } = useVoiceCore(appId);
  React.useEffect(() => { loadContext(); }, [loadContext]);
  const shadowRoot = React.useMemo(() => ensureShadowHost(), []);
  const button = (
    <>
      <style>{shadowStyles}</style>
      <div className="voice-agent-container">
        <div
          role="button"
          aria-label={state.isRecording ? 'Stop recording' : 'Start recording'}
          className={state.isRecording ? 'voice-agent-button recording' : 'voice-agent-button'}
          onClick={() => { resumeTTSIfNeeded(); state.isRecording ? stopListening() : startListening(); }}
        >
          {state.isRecording ? '■' : '🎤'}
        </div>
      </div>
    </>
  );
  return ReactDOM.createPortal(button, shadowRoot);
};

const shadowStyles = `
  :host { all: initial; }
  .voice-agent-container { position: fixed; right: 24px; bottom: 24px; width: 56px; height: 56px; z-index: 2147483000; pointer-events: auto; }
  .voice-agent-button { all: initial; width: 56px; height: 56px; border-radius: 50%; display: inline-grid; place-items: center; background: #6a5acd; color: #fff; cursor: pointer; box-shadow: 0 10px 30px rgba(106,90,205,.4); border: none; outline: none; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-size: 24px; }
  .voice-agent-button.recording { animation: voice-agent-pulse 1.2s ease-in-out infinite; }
  @keyframes voice-agent-pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(106,90,205,.7);} 70% { transform: scale(1.05); box-shadow: 0 0 0 14px rgba(106,90,205,0);} 100% { transform: scale(1);} }
`;

function ensureShadowHost(): ShadowRoot {
  const hostId = 'voice-agent-shadow-host';
  let host = document.getElementById(hostId) as HTMLElement | null;
  if (!host) {
    host = document.createElement('div');
    host.id = hostId;
    host.style.position = 'fixed';
    host.style.right = '0px';
    host.style.bottom = '0px';
    host.style.zIndex = '2147483000';
    document.body.appendChild(host);
  }
  const existing = (host as any).shadowRoot as ShadowRoot | null;
  if (existing) return existing;
  return host.attachShadow({ mode: 'open' });
}


