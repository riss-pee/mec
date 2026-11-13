/**
 * ZIRNA STEM STUDIO — Legal, Privacy, Compliance & Accessibility Types
 */

export type LegalViewId = 
  | 'privacy' 
  | 'terms' 
  | 'refund' 
  | 'cookies' 
  | 'accessibility' 
  | 'about' 
  | 'contact' 
  | 'data-deletion';

export interface StorageConsentPreferences {
  version: string;
  timestamp: string;
  hasConsented: boolean;
  essential: boolean;     // Strictly necessary for module state (always true)
  functional: boolean;    // Language, audio mute preference, recent modules
  analytics: boolean;     // Privacy-friendly telemetry / error reports (currently none implemented)
}

export interface DataDeletionRequest {
  id: string;
  requestType: 'erase_local' | 'access_inquiry' | 'delete_inquiry' | 'grievance';
  name?: string;
  email?: string;
  message?: string;
  timestamp: string;
  status: 'submitted' | 'completed';
}

export interface OrganizationInfo {
  name: string;
  legalEntityPlaceholder: string;
  mission: string;
  addressPlaceholder: string;
  contactEmailPlaceholder: string;
  grievanceOfficerPlaceholder: string;
  registrationPlaceholder: string;
  jurisdiction: string;
}

export const DEFAULT_STORAGE_CONSENT: StorageConsentPreferences = {
  version: '1.0',
  timestamp: '',
  hasConsented: false,
  essential: true,
  functional: true,
  analytics: false,
};

export const ZIRNA_ORGANIZATION: OrganizationInfo = {
  name: 'ZIRNA STEM STUDIO',
  legalEntityPlaceholder: '[Insert Official Registered Organization / Society Name, e.g., Mizoram Education Centre / Zirna Learning Initiative]',
  mission: 'Empowering students and educators with hands-on, interactive mathematics and physics simulations, with bilingual support (Mizo & English).',
  addressPlaceholder: '[Insert Official Registered Physical Address, e.g., Aizawl, Mizoram 796001, India]',
  contactEmailPlaceholder: '[Insert Official Contact Email, e.g., contact@zirnastem.org]',
  grievanceOfficerPlaceholder: '[Insert Name & Contact of Designated Grievance Officer / Data Protection Officer as required under Indian IT Rules and DPDP Act 2023]',
  registrationPlaceholder: '[Insert Society Registration Number / CIN / NGO Darpan ID if applicable]',
  jurisdiction: 'Aizawl, Mizoram, India (subject to applicable Indian laws including the Digital Personal Data Protection Act, 2023)',
};
