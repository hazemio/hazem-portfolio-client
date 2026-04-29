import React from 'react';
import * as Fa from 'react-icons/fa';
import * as Si from 'react-icons/si';
import * as Ai from 'react-icons/ai';
import * as Bi from 'react-icons/bi';
import * as Fi from 'react-icons/fi';

// Merge all icon packs into one lookup
const allIcons: Record<string, React.ComponentType<any>> = {
  ...Fa, ...Si, ...Ai, ...Bi, ...Fi,
};

interface DynamicIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function DynamicIcon({ name, size = 20, className, style }: DynamicIconProps) {
  const Icon = allIcons[name];
  if (!Icon) return <Fa.FaQuestionCircle size={size} className={className} style={style} />;
  return <Icon size={size} className={className} style={style} />;
}

// Map platform names → icon names for social links
export const platformIconMap: Record<string, string> = {
  github:    'FaGithub',
  linkedin:  'FaLinkedin',
  twitter:   'FaTwitter',
  instagram: 'FaInstagram',
  facebook:  'FaFacebook',
  youtube:   'FaYoutube',
  dribbble:  'FaDribbble',
  behance:   'FaBehance',
  medium:    'FaMedium',
  dev:       'FaDev',
  website:   'FaGlobe',
  email:     'FaEnvelope',
};
