import React, { useState, useEffect } from 'react';
import { Camera, Film, Video, Mail, Phone, Linkedin, MapPin, ChevronDown, Play, Pause, Award, Clapperboard, MonitorPlay } from 'lucide-react';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRecording, setIsRecording] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">

      {/* Efecto de fondo ambiental */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Navegación */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
            SERGIO MARTINEZ <span className="text-blue-500">.TV</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            {['Experiencia', 'Habilidades', 'Educación', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className="hover:text-blue-400 transition-colors uppercase"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="relative min-h-screen flex items-center justify-center pt-20 z-10">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase">
              <Camera size={14} />
              Camarógrafo Profesional
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              CAPTANDO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                MOMENTOS
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Especialista en cámaras HD/4K, movimientos de travelling y composición visual.
              Experiencia en TV en vivo, noticieros, videos musicales y streaming.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => scrollTo('contacto')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center gap-2"
              >
                <Mail size={18} /> Contáctame
              </button>
              <button
                onClick={() => scrollTo('experiencia')}
                className="px-8 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-bold rounded-full transition-all flex items-center gap-2"
              >
                <Film size={18} /> Ver Reel / CV
              </button>
            </div>

            <div className="flex items-center gap-6 pt-8 text-slate-500">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> CABA, Argentina
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} /> +15 Años de Exp.
              </div>
            </div>
          </div>

          <div className="relative group perspective-1000">
            <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center shadow-2xl">
                <div className="absolute inset-0 border border-slate-700 rounded-full scale-110 opacity-50"></div>
                <div className="absolute inset-0 border border-slate-700 rounded-full scale-125 opacity-20 border-dashed animate-[spin_10s_linear_infinite]"></div>

                {/* Imagen de Perfil con manejo de errores */}
                <ProfileImage />

              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-600">
          <ChevronDown size={24} />
        </div>
      </header>

      {/* Sección de Experiencia */}
      <section id="experiencia" className="py-24 relative z-10 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px bg-blue-500 w-12"></div>
            <h2 className="text-3xl font-bold tracking-tight">EXPERIENCIA PROFESIONAL</h2>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-12">
            <TimelineItem
              role="Camarógrafo (Freelance)"
              company="Gimbal Producciones"
              location="Argentina"
              period="Actualidad"
              description="Llevar a cabo tomas para programas de YouTube, asistir al talento, posicionamiento de luces y movimientos de cámara. Grabación con cámaras Sony XDCAM-EX 4K."
            />
            <TimelineItem
              role="Camarógrafo (Freelance)"
              company="A+V Eventos"
              location="Argentina"
              period="Proyectos Varios"
              description="Vivo para redes o grabación, manejo de equipos de video HD/4K. Balance de cámaras, ejecución de planos, composición, encuadres, traveling y montaje técnico."
            />
            <TimelineItem
              role="Camarógrafo de Estudio y Exteriores"
              company="Televen"
              location="Venezuela"
              period="2012 - 2018"
              description="Encargado de manejar la cámara y captar imágenes. Movimientos o planos fijos. Ubicación de talentos e iluminación estratégica. Uso de Dolly In/Out, Panning, Tilt Up/Down."
            />
            <TimelineItem
              role="Camarógrafo"
              company="Venevisión"
              location="Venezuela"
              period="2008 - 2012"
              description="Titular de estudio de televisión en variedades y dramáticos. Captura de momentos en grabaciones o señal en vivo siguiendo órdenes del Director."
            />
            <TimelineItem
              role="Camarógrafo"
              company="RCTV"
              location="Venezuela"
              period="2007 - 2008"
              description="Ejecutar planos acorde a lo solicitado por el director. Movimientos y planos secuencias."
            />
          </div>
        </div>
      </section>

      {/* Sección de Habilidades */}
      <section id="habilidades" className="py-24 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-end gap-3 mb-16 text-right">
            <h2 className="text-3xl font-bold tracking-tight">HABILIDADES TÉCNICAS</h2>
            <div className="h-px bg-blue-500 w-12"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkillCard icon={<Video />} title="Cámaras HD / 4K" desc="Sony XDCAM, DSLR, Mirrorless" />
            <SkillCard icon={<MonitorPlay />} title="Movimientos de Cámara" desc="Traveling, Dolly, Panning, Tilt" />
            <SkillCard icon={<Clapperboard />} title="Composición e Iluminación" desc="Encuadres, planos fijos, lógica de luz" />
            <SkillCard icon={<Film />} title="Equipamiento" desc="Manejo de Porta-Jib, Trípodes, Gimbal" />
            <SkillCard icon={<Play />} title="Formatos" desc="Noticieros, Videos Musicales, Streaming" />
            <SkillCard icon={<Award />} title="Trabajo en Equipo" desc="Coordinación con directores y asistentes" />
          </div>
        </div>
      </section>

      {/* Sección de Educación */}
      <section id="educacion" className="py-24 bg-slate-900/30 border-y border-slate-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">FORMACIÓN ACADÉMICA</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Técnico Superior Universitario Audiovisuales</h3>
              <p className="text-white font-medium">Cecilio Acosta</p>
              <p className="text-slate-500 text-sm">Venezuela</p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Bachiller en Ciencias</h3>
              <p className="text-white font-medium">Instituto Central de Educación</p>
              <p className="text-slate-500 text-sm">Venezuela</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Contacto */}
      <footer id="contacto" className="py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="inline-block p-3 rounded-full bg-blue-500/10 mb-6">
            <Mail className="text-blue-400" size={32} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-8">¿LISTO PARA RODAR?</h2>
          <p className="text-slate-400 text-lg mb-12">
            Disponible para proyectos freelance, eventos y producciones de TV en CABA y alrededores.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <a href="mailto:sergiomartinez2055@gmail.com" className="group flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-blue-600 hover:border-blue-500 transition-all duration-300">
              <Mail className="mb-4 text-slate-400 group-hover:text-white" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">sergiomartinez2055@gmail.com</span>
            </a>
            <a href="https://wa.me/5491122553197" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-green-600 hover:border-green-500 transition-all duration-300">
              <Phone className="mb-4 text-slate-400 group-hover:text-white" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">11-2255-3197</span>
            </a>
            <a href="https://www.linkedin.com/in/sergio-martinez-cam" className="group flex flex-col items-center p-6 bg-slate-900 border border-slate-800 rounded-xl hover:bg-blue-800 hover:border-blue-700 transition-all duration-300">
              <Linkedin className="mb-4 text-slate-400 group-hover:text-white" />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">Sergio Martinez</span>
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            <p>Registro de conducir al día. Nacionalidad Venezolana. Residencia en CABA.</p>
            <p className="mt-2">&copy; {new Date().getFullYear()} Sergio Martinez - Portfolio Audiovisual</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

// --- Sub-componentes ---

const ProfileImage = () => {
  // Asegúrate de que este archivo esté en la carpeta /public de tu proyecto local
  const [imgSrc, setImgSrc] = useState('sergio.jpg');
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("https://via.placeholder.com/400x400/0f172a/3b82f6?text=Sergio+Martinez");
    }
  };

  return (
    <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-slate-800 relative z-10 group-hover:scale-105 transition-transform duration-500 bg-slate-800">
      <img
        src={imgSrc}
        alt="Sergio Martinez"
        onError={handleError}
        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      />
      <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
    </div>
  );
};

const TimelineItem = ({ role, company, location, period, description }) => (
  <div className="relative pl-8 pb-12 last:pb-0 group">
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10"></div>
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{role}</h3>
      <span className="text-sm font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">{period}</span>
    </div>
    <div className="text-blue-500 font-medium mb-3 flex items-center gap-2">
      {company} <span className="text-slate-600">•</span> <span className="text-slate-400 text-sm font-normal">{location}</span>
    </div>
    <p className="text-slate-400 leading-relaxed max-w-2xl">{description}</p>
  </div>
);

const SkillCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 group transition-all duration-300 cursor-default">
    <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

export default App;