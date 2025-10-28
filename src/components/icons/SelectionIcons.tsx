import React from 'react';
import { 
  User, 
  UserCheck, 
  Users, 
  Weight, 
  Circle, 
  Zap, 
  Leaf, 
  Pill,
  Droplets,
  FlaskConical,
  Package,
  Gauge,
  Target,
  TrendingUp,
  Star,
  Award,
  GraduationCap,
  BookOpen,
  Brain
} from 'lucide-react';

// Gender Icons
export const GenderIcons = {
  male: User,
  female: UserCheck,
  other: Users
};

// Substance Icons
export const SubstanceIcons = {
  psilocybin: Circle,
  lsd: Zap,
  amanita: Leaf,
  ketamine: Pill
};

// Intake Form Icons
export const IntakeFormIcons = {
  dried_mushrooms: Circle,
  fresh_mushrooms: Leaf,
  truffles: Package,
  pure_extract: FlaskConical,
  blotter: Package,
  liquid: Droplets,
  capsules: Pill
};

// Goal Icons
export const GoalIcons = {
  sub_perceptual: Target,
  standard: Gauge,
  upper_microdose: TrendingUp
};

// Experience Icons
export const ExperienceIcons = {
  beginner: BookOpen,
  intermediate: GraduationCap,
  experienced: Award
};

// Sensitivity Icons
export const SensitivityIcon = Brain;
