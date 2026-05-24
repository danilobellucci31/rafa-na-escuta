import React, { useState } from "react";
import { UserProfile } from "../types";
import { ArrowLeft, User, Mail, ShieldAlert, Heart, Save, CheckCircle } from "lucide-react";

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onGoBack: () => void;
  fontSizeLarge: boolean;
}

export default function ProfileScreen({
  userProfile,
  onUpdateProfile,
  onGoBack,
  fontSizeLarge,
}: ProfileScreenProps) {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [contactName, setContactName] = useState(userProfile.emergencyContactName);
  const [contactPhone, setContactPhone] = useState(userProfile.emergencyContactPhone);
  const [medicalNotes, setMedicalNotes] = useState(userProfile.medicalNotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name,
      email,
      emergencyContactName: contactName,
      emergencyContactPhone: contactPhone,
      medicalNotes,
    };
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3 relative">
      
      {/* Absolute Floating Toast Confirmation */}
      {savedSuccess && (
        <div 
          id="toast-success-profile" 
          className="absolute top-2 left-2 right-2 bg-emerald-600 text-white p-3.5 rounded-2xl border-2 border-emerald-700 shadow-md flex items-center gap-3.5 z-50 animate-bounce"
        >
          <div className="bg-white/10 p-1.5 rounded-xl shrink-0">
            <CheckCircle className="w-6 h-6 text-white shrink-0" />
          </div>
          <div className="flex-1 text-left">
            <span className="block text-md font-black leading-tight tracking-tight">Alterações Salvas!</span>
            <span className="block text-xs font-semibold opacity-95">Seus dados de saúde foram atualizados com segurança.</span>
          </div>
        </div>
      )}

      {/* Top action header */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 select-none font-display">
        <button
          id="profile-back-btn"
          onClick={onGoBack}
          className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-base"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span>Voltar</span>
        </button>
        <span className="text-xl font-black text-slate-800 tracking-tight font-display ml-1">Meu Perfil</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* Name input */}
        <div className="space-y-0.5">
          <label htmlFor="p-name" className="block text-sm font-bold text-slate-700 text-left">Meu Nome:</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              id="p-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-base pl-10 pr-3 py-2 border-2 border-slate-200 rounded-xl bg-white focus:border-sky-500 font-medium font-sans"
              required
            />
          </div>
        </div>

        {/* Email read only */}
        <div className="space-y-0.5">
          <label htmlFor="p-email" className="block text-xs font-bold text-slate-400 text-left">Meu E-mail (Identificador):</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
            <input
              id="p-email"
              type="email"
              value={email}
              disabled
              title="O e-mail não pode ser alterado"
              className="w-full text-base pl-10 pr-3 py-2 border border-slate-100 rounded-xl bg-slate-50 text-slate-400 font-medium font-sans cursor-not-allowed"
            />
          </div>
        </div>

        {/* EMERGENCY AREA BOUNDARY - layout as two side-by-side columns to save screen space */}
        <div className="bg-red-50/70 border-2 border-red-100 rounded-2xl p-3 space-y-2">
          <h3 className="text-sm font-black text-red-900 flex items-center gap-1.5 text-left">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <span>Familiar para Emergências:</span>
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <label htmlFor="p-contact-name" className="block text-xs font-bold text-slate-700 text-left">Nome:</label>
              <input
                id="p-contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ex: Maria"
                className="w-full text-sm p-1.5 border border-slate-200 rounded-xl bg-white focus:border-red-500 font-medium font-sans"
              />
            </div>

            <div className="space-y-0.5">
              <label htmlFor="p-contact-phone" className="block text-xs font-bold text-slate-700 text-left">Telefone:</label>
              <input
                id="p-contact-phone"
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Ex: (11) 99999-9999"
                className="w-full text-sm p-1.5 border border-slate-200 rounded-xl bg-white focus:border-red-500 font-medium font-sans"
              />
            </div>
          </div>
        </div>

        {/* MEDICAL HEALTH RECORD NOTES - more compact */}
        <div className="bg-sky-50/70 border-2 border-sky-100 rounded-2xl p-3 space-y-1">
          <h3 className="text-sm font-black text-sky-900 flex items-center gap-1.5 text-left">
            <Heart className="w-5 h-5 text-red-500 shrink-0 fill-current" />
            <span>Remédios & Saúde Importantes:</span>
          </h3>
          <textarea
            id="p-medical-notes"
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            rows={2}
            className="w-full text-sm p-2 border border-slate-200 rounded-xl bg-white focus:border-sky-500 font-medium"
            placeholder="Ex: Remédio de coração de manhã. Alergia a Novalgina."
          />
        </div>

        <button
          id="profile-save-btn"
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl text-lg font-black border-2 border-emerald-800 shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Save className="w-5 h-5 shrink-0" />
          <span>Guardar Alterações</span>
        </button>
      </form>
    </div>
  );
}
