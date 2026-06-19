export enum StudentNiveau {
  L1_ANNEE = 'L1_ANNEE',
  L2_ANNEE = 'L2_ANNEE',
  L3_ANNEE = 'L3_ANNEE',
  L4_ANNEE = 'L4_ANNEE',
  L5_ANNEE = 'L5_ANNEE'
}

export enum TypeBourse {
  EXCELLENCE = 'EXCELLENCE',
  SOCIALE = 'SOCIALE',
  MERITE = 'MERITE',
  AUTRE = 'AUTRE',
}

export enum StatutInscription {
  EN_ATTENTE = 'EN_ATTENTE',
  VALIDEE = 'VALIDEE',
  REJETEE = 'REJETEE',
  EN_COURS_VERIFICATION = 'EN_COURS_VERIFICATION',
}

export enum SourceVerification {
  API_UNIVERSITE = 'API_UNIVERSITE',
  MANUELLE = 'MANUELLE',
  AUTRE = 'AUTRE',
}

export interface InscriptionAnnuelleRequest {
  studentTrackingId: string;
  academicYearLabel: string;
  studyLevel: StudentNiveau;
  totalValidatedCredits: number;
  highSchoolGrade: number; // BigDecimal from backend -> number
  isScholarshipHolder: boolean;
  scholarshipType?: TypeBourse; // Optional as per backend, and can be null if not scholarship holder
  status?: StatutInscription; // Backend default value or service will set it
  source?: SourceVerification; // Backend default value or service will set it
}

export interface InscriptionAnnuelleResponse {
  trackingId: string;
  studentTrackingId: string;
  studentLastName: string;
  studentFirstName: string;
  studentIdNumber: string;
  academicYearLabel: string;
  studyLevel: StudentNiveau;
  isFullyEnrolled: boolean;
  isEligibleForScholarship: boolean;
  scholarshipType?: TypeBourse;
  apiValidationDate?: string; // LocalDateTime from backend -> string
  allocatedBudget?: number; // BigDecimal from backend -> number
}
