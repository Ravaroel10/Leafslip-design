
import React from 'react';
import { 
  Leaf, Camera, BarChart3, Receipt, Smartphone, Trash2, ArrowUpRight, ShieldCheck,
  Instagram, Facebook, Mail, Phone, ArrowUp 
} from 'lucide-react';

export const COLORS = {
  primary: '#2D3E2D',
  accent: '#D9ED92',
  bg: '#F8F9FA',
  success: '#4ADE80',
  warning: '#FBBF24',
};

export const IMPACT_STATS = [
  { label: 'MSMEs Empowered', value: '12,400+', icon: <ShieldCheck className="w-5 h-5" /> },
  { label: 'Food Waste Prevented', value: '85 Tons', icon: <Trash2 className="w-5 h-5" /> },
  { label: 'Paper Saved', value: '1.2M Receipts', icon: <Receipt className="w-5 h-5" /> },
];

export const ICONS = {
  Leaf: <Leaf className="w-6 h-6" />,
  Camera: <Camera className="w-5 h-5" />,
  Chart: <BarChart3 className="w-5 h-5" />,
  Receipt: <Receipt className="w-5 h-5" />,
  Mobile: <Smartphone className="w-5 h-5" />,
  Trend: <ArrowUpRight className="w-4 h-4" />,
  Instagram: <Instagram className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Phone: <Phone className="w-5 h-5" />,
  ArrowUp: <ArrowUp className="w-5 h-5" />,
};

export const AIMS = [
  { id: 1, text: 'Digitalize every paper receipt for better MSME tracking.' },
  { id: 2, text: 'Reduce regional food waste through smart stock management.' },
  { id: 3, text: 'Empower local businesses with AI-driven growth insights.' },
];

export const BENEFITS = [
  { id: 1, text: 'Automated digital record keeping from physical receipts.' },
  { id: 2, text: 'Predictive stock management to avoid spoilage.' },
  { id: 3, text: 'Professional financial reporting for MSME growth.' },
];

export const SERVICES = [
  {
    id: 1,
    title: 'Smart OCR Scanner',
    description: 'Transform paper clutter into searchable digital data using high-accuracy OCR powered by Gemini.',
    tag: 'DIGITALIZATION',
  },
  {
    id: 2,
    title: 'AI Stock Advisor',
    description: 'Receive personalized recommendations to optimize your inventory levels and reduce waste.',
    tag: 'INTELLIGENCE',
  },
  {
    id: 3,
    title: 'Waste Tracker',
    description: 'Identify patterns in slow-moving items to prevent spoilage and financial losses.',
    tag: 'SUSTAINABILITY',
  },
];
