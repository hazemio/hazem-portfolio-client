import HeroSection from '../components/sections/Hero';
import AboutSection from '../components/sections/About';
import SkillsSection from '../components/sections/Skills';
import ProjectsSection from '../components/sections/Projects';
import FootballHeroesSection from '../components/sections/FootballHeroesSection';
import CertificatesSection from '../components/sections/Certificates';
import ExperienceSection from '../components/sections/Experience';
import ContactSection from '../components/sections/Contact';
import LinesBackground from '../pages/cnavabg/LinesBackground';

export default function PortfolioPage() {
  return (
    <main>
      <LinesBackground />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertificatesSection />
      <ExperienceSection />
      <FootballHeroesSection />
      <ContactSection />
    </main>
  );
}
