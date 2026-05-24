import React, { useState } from "react";
import { X, Phone, Heart, ShieldAlert, Award, FileText } from "lucide-react";
import { UserProfile } from "../types";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function EmergencyModal({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}: EmergencyModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contactName, setContactName] = useState(userProfile?.emergencyContactName || "Familiar de Confiança");
  const [contactPhone, setContactPhone] = useState(userProfile?.emergencyContactPhone || "");
  const [medicalNotes, setMedicalNotes] = useState(
    userProfile?.medicalNotes || "Ex: Tomo remédio para pressão de manhã. Alergia a dipirona."
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (userProfile) {
      const updated: UserProfile = {
        ...userProfile,
        emergencyContactName: contactName,
        emergencyContactPhone: contactPhone,
        medicalNotes: medicalNotes,
      };
      onUpdateProfile(updated);
      setIsEditing(false);
    }
  };

  return (
    <div id="emergency-modal-overlay" className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
      <div 
        id="emergency-modal-content" 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border-8 border-red-600 flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Urgent Header */}
        <div className="bg-red-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 animate-bounce" />
            <span className="text-2xl font-bold font-display tracking-tight">Preciso de Ajuda</span>
          </div>
          <button 
            id="close-emergency"
            onClick={onClose}
            className="bg-red-800 hover:bg-red-950 p-3 rounded-full text-white transition-colors focus:ring-4 focus:ring-white"
            aria-label="Fechar tela de ajuda"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Action Panel */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-xl font-medium text-slate-800 leading-relaxed text-center">
            Não se preocupe! Respire fundo. Escolha abaixo o que você quer fazer agora:
          </p>

          <div className="grid grid-cols-1 gap-4">
            {/* Call Predefined Family Contact */}
            {userProfile?.emergencyContactPhone ? (
              <a 
                id="call-family-btn"
                href={`tel:${userProfile.emergencyContactPhone}`}
                className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-5 rounded-2xl flex items-center justify-center gap-4 border-2 border-emerald-800 shadow-md text-2xl font-bold transition-all"
              >
                <Phone className="w-9 h-9 shrink-0" />
                <div className="text-left">
                  <span className="block text-sm font-normal text-emerald-100">Ligar para Familiar</span>
                  <span className="block">{userProfile.emergencyContactName}</span>
                </div>
              </a>
            ) : (
              <button 
                id="configure-contact-trigger"
                onClick={() => setIsEditing(true)}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 p-5 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-amber-400 text-xl font-medium transition-colors"
              >
                <Phone className="w-9 h-9 text-amber-700 mb-1" />
                <span>Nenhum familiar cadastrado</span>
                <span className="text-sm font-normal underline mt-1 text-amber-800">Clique para cadastrar um telefone</span>
              </button>
            )}

            {/* CALL SAMU 192 (Universal Emergency Brazil) */}
            <a 
              id="call-samu-btn"
              href="tel:192"
              className="bg-red-700 hover:bg-red-800 active:scale-95 text-white p-5 rounded-2xl flex items-center justify-center gap-4 border-2 border-red-950 shadow-md text-2xl font-bold transition-all"
            >
              <Phone className="w-10 h-10 animate-pulse shrink-0" />
              <div className="text-left">
                <span className="block text-sm font-normal text-red-200">Chamar Ambulância</span>
                <span className="block">Ligar para SAMU (192)</span>
              </div>
            </a>
          </div>

          {/* Core Medical Health Information Display */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 text-slate-800 text-lg font-bold">
                <FileText className="w-6 h-6 text-red-600" />
                <span>Minhas Informações Médicas</span>
              </div>
              <button 
                id="edit-medical-info-btn"
                onClick={() => setIsEditing(!isEditing)}
                className="text-sky-600 text-md font-bold underline hover:text-sky-800"
              >
                {isEditing ? "Cancelar" : "Alterar"}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label htmlFor="contact-name-input" className="block text-md font-bold text-slate-700 mb-1">Nome do Contato:</label>
                  <input 
                    id="contact-name-input"
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full text-lg p-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 bg-white"
                    placeholder="Ex: Minha filha Maria"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone-input" className="block text-md font-bold text-slate-700 mb-1">Telefone Celular:</label>
                  <input 
                    id="contact-phone-input"
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full text-lg p-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 bg-white"
                    placeholder="Ex: (11) 99999-9999"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="medical-notes-input" className="block text-md font-bold text-slate-700 mb-1">Doenças, Remédios ou Alergias importantes:</label>
                  <textarea 
                    id="medical-notes-input"
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    rows={3}
                    className="w-full text-lg p-3 border-2 border-slate-300 rounded-xl focus:border-sky-500 bg-white"
                    placeholder="Escreva aqui se toma remédios de pressão, se tem asma, alergias, etc."
                  />
                </div>
                <button 
                  id="submit-medical-info"
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white p-4 rounded-xl text-xl font-bold transition-colors"
                >
                  Salvar Informações
                </button>
              </form>
            ) : (
              <div className="space-y-3 text-slate-700 text-lg">
                <div>
                  <span className="font-bold text-slate-500 block text-sm uppercase">Nome do Idoso</span>
                  <span className="text-xl font-bold text-slate-900">{userProfile?.name || "Visitante"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-bold text-slate-500 block text-sm uppercase">Familiar Principal</span>
                    <span className="font-medium text-slate-900">{userProfile?.emergencyContactName || "Não cadastrado"}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 block text-sm uppercase">Telefone</span>
                    <span className="font-medium text-slate-900">{userProfile?.emergencyContactPhone || "Não cadastrado"}</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block text-sm uppercase">Nota de Saúde Importante</span>
                  <p className="bg-white p-3 rounded-lg border border-slate-100 text-slate-800 leading-relaxed font-mono text-md">
                    {userProfile?.medicalNotes || "Nenhuma informação cadastrada ainda."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Soothing reassurance footer */}
        <div className="bg-slate-100 p-4 text-center border-t border-slate-200">
          <p className="text-slate-600 flex items-center justify-center gap-2 text-md">
            <Heart className="w-5 h-5 text-red-600 fill-current" />
            <span>Professor Rafa está aqui na escuta torcendo por você!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
