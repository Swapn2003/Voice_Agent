import React, { useEffect, useMemo, useState } from 'react';
import { VoiceAgent } from 'voice-agent-lib';
import axios from 'axios';

type Case = { id: number; title: string; status: string; assignedTo: string };

export const App: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filters, setFilters] = useState<{ status?: string; assignedTo?: string }>({});

  useEffect(() => {
    void (async () => {
      const res = await axios.get('/api/cases');
      setCases(res.data || []);
    })();
  }, []);

  const visible = useMemo(() => {
    return cases.filter((c) => {
      if (filters.status && c.status.toLowerCase() !== filters.status.toLowerCase()) return false;
      if (filters.assignedTo === 'me' && c.assignedTo.toLowerCase() !== 'analyst') return false;
      return true;
    });
  }, [cases, filters]);

  return (
    <div className="app">
      <div className="container">
        <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <h2>Case Management Demo</h2>
          <div className="row">
            <select className="btn" value={filters.status || ''} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <button className="btn" onClick={() => setFilters({})}>Clear</button>
          </div>
        </div>
        <div className="card" style={{ marginTop: 16 }}>
          <table className="table" data-cases-table="true">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>
                    <span className={`pill ${c.status === 'pending' ? 'warn' : c.status === 'open' ? 'ok' : 'danger'}`}>{c.status}</span>
                  </td>
                  <td>{c.assignedTo}</td>
                  <td>
                    <button className="btn">Email Bank</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VoiceAgent appId="demoApp" />
    </div>
  );
};


