'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadPDF, getKnowledgebaseStatus, getApplicants, getApplicantById } from '@/services/api';
import { 
  Upload, 
  FileText, 
  Users, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Search,
  ChevronRight,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

export default function AdminDashboard() {
  const router = useRouter();
  const [knowledgebase, setKnowledgebase] = useState({ uploaded: false });
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [kbRes, appRes] = await Promise.all([
        getKnowledgebaseStatus(),
        getApplicants()
      ]);
      setKnowledgebase(kbRes);
      setApplicants(appRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadPDF(file);
      if (res.success) {
        setKnowledgebase({ uploaded: true, filename: res.filename });
        alert('PDF uploaded successfully!'); 
      } else {
        alert(res.error || 'Failed to upload PDF');
      }
    } catch (error) {
      alert('Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleStartInterview = () => {
    if (!knowledgebase.uploaded) {
      alert('Please upload a PDF first');
      return;
    }
    router.push('/interview');
  };

  const handleViewTranscript = async (id) => {
    try {
      const res = await getApplicantById(id);
      if (res.success) {
        setSelectedApplicant(res.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Failed to load transcript:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Initializing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <GraduationCap size={20} />
            </div>
            <h1 className="font-heading font-bold text-xl text-primary tracking-tight">
              Falcon University
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
              Admin Portal
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-primary mb-2">Dashboard Overview</h2>
          <p className="text-slate-500 max-w-2xl">
            Manage course requirements, initiate interviews, and review applicant outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${knowledgebase.uploaded ? 'text-green-600' : 'text-slate-400'}`}>
              <FileText size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <FileText size={24} />
                </div>
                {knowledgebase.uploaded ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-100">
                    <CheckCircle2 size={12} />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                    <AlertCircle size={12} />
                    Missing Requirements
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-primary mb-1">Knowledge Base</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">
                {knowledgebase.uploaded 
                  ? `Loaded: ${knowledgebase.filename}`
                  : 'Upload the course requirements PDF to enable interviews.'}
              </p>

              <label className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-sm active:scale-95 text-sm">
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploading ? 'Uploading...' : 'Upload PDF'}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
              <Users size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Play size={24} />
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-primary mb-1">New Interview</h3>
              <p className="text-sm text-slate-500 mb-6 h-10">
                Start a new AI-driven interview session based on the uploaded requirements.
              </p>

              <button
                onClick={handleStartInterview}
                disabled={!knowledgebase.uploaded}
                className={clsx(
                  "inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95",
                  knowledgebase.uploaded
                    ? "bg-primary text-white hover:bg-slate-800"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                <Play size={16} fill="currentColor" />
                Start Interview
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Users size={20} className="text-slate-400" />
              Recent Applicants
            </h3>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search applicants..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
              />
            </div>
          </div>

          {applicants.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Users size={32} />
              </div>
              <h4 className="text-primary font-medium mb-1">No applicants found</h4>
              <p className="text-slate-500 text-sm">Start an interview to see results populate here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-6 py-4">Applicant</th>
                    <th className="px-6 py-4">Program</th>
                    <th className="px-6 py-4">Outcome</th>
                    <th className="px-6 py-4">Summary</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {applicants.map((applicant) => (
                    <tr key={applicant._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {applicant.studentName[0]}
                          </div>
                          <span className="font-medium text-slate-900">{applicant.studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{applicant.program}</td>
                      <td className="px-6 py-4">
                        <span className={clsx(
                          "px-2.5 py-1 rounded-full text-xs font-medium border",
                          applicant.outcome === 'Meets Criteria'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                        )}>
                          {applicant.outcome}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={applicant.ruleSummary}>
                        {applicant.ruleSummary}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleViewTranscript(applicant._id)}
                          className="text-primary hover:text-indigo-600 font-medium text-xs inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Transcript
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {showModal && selectedApplicant && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Interview Transcript
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedApplicant.studentName} • {selectedApplicant.program}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
              <div className="space-y-6">
                {selectedApplicant.transcript?.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "flex gap-3",
                        isUser ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <div className={clsx(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0",
                        isUser 
                          ? "bg-primary text-white border-primary" 
                          : "bg-white text-slate-600 border-slate-200"
                      )}>
                        {isUser ? "S" : "AI"}
                      </div>
                      <div className={clsx(
                        "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                        isUser
                          ? "bg-primary text-white rounded-tr-sm"
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                      )}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}