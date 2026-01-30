import React, { useState, useEffect } from 'react';
import { Camera, Film, Video, Mail, Phone, Linkedin, MapPin, ChevronDown, Play, Pause, Award, Clapperboard, MonitorPlay, FileDown, LogIn, LogOut, Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { auth, googleProvider, db, storage } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const App = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRecording, setIsRecording] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cvData, setCvData] = useState({
    hero: {
      titleLine1: "CAPTANDO",
      titleLine2: "MOMENTOS",
      description: "Especialista en cámaras HD/4K, movimientos de travelling y composición visual. Experiencia en TV en vivo, noticieros, videos musicales y streaming.",
      profileImage: "sergio.jpg"
    },
    experience: [
      { role: "Camarógrafo (Freelance)", company: "Gimbal Producciones", location: "Argentina", period: "Actualmente", description: " Llevar a cabo tomas para programa de youtube,asistir al talento ,su posicion de luz y movimientos a realizar con la cámara.grabación con cámaras sony xdcam-ex 4k." },
      { role: "Camarógrafo (Freelance)", company: "A+V Eventos", location: "Argentina", period: "Actualmente", description: " Vivo para redes o grabación, manejo de los equipos de video con definicion hd o 4k. balance de cámaras,ejecutar planos de acuerdo a la ocasión,composicion y encuadres ,traveling y todo lo necesario para concretar la grabacion." },
      { role: "Camarógrafo de Estudio y Exteriores", company: "Televen", location: "Venezuela", period: "2012 - 2018", description: "Encargado de manejar la cámara y captar imágenes haciendo movimientos o planos fijos,Ubicar a los Talentos en posicion de luz,estratégica para la composicion del plano.Utilizacion de auriculares para recibir instruciones del Director encargado y central de video. Colocar las Cámaras en posicion para balance de blancos. Ejecutar movimientos travelling,dolly in, dolly out,panning,tilt up,tilt down con o sin tripode de manera creativa siempre y cuando exista un plano justificado. Coordinar de manera efectiva con los asistentes de cámaras los movimientos a realizar." },
      { role: "Camarógrafo", company: "Venevisión", location: "Venezuela", period: "2008 - 2012", description: "Titular de estudio de television como variedades y dramaticos,como Portadas, A que te ries, Que locura, programas de entrenimiento. Captar imagenes de momentos, en la grabaciones o señal en vivo. siguiendo las ordenes del Director,Manejo de planos,composicion y encuadre. Experiencia en Cámaras con tripode y portatil." },
      { role: "Camarógrafo", company: "RCTV", location: "Venezuela", period: "2007 - 2008", description: " Ejecutar planos acorde a lo solicitado por el director, movimientos y planos secuencias. ubicar al periodista en la luz indicada." }
    ],
    education: [
      { title: "Técnico Superior Universitario Audiovisuales", school: "Cecilio Acosta", location: "Venezuela" },
      { title: "Bachiller en Ciencias", school: "Instituto Central de Educación", location: "Venezuela" }
    ],
    skills: [
      { title: "Cámaras HD / 4K", desc: "Sony XDCAM, DSLR, Mirrorless" },
      { title: "Movimientos de Cámara", desc: "Traveling, Dolly, Panning, Tilt" },
      { title: "Composición e Iluminación", desc: "Encuadres, planos fijos, lógica de luz" },
      { title: "Equipamiento", desc: "Manejo de Porta-Jib, Trípodes, Gimbal" },
      { title: "Formatos", desc: "Noticieros, Videos Musicales, Streaming" },
      { title: "Trabajo en Equipo", desc: "Coordinación con directores y asistentes" }
    ],
    media: []
  });

  // Lista de correos con acceso admin
  const adminEmails = ['sergiomartinez2055@gmail.com', 'mdoguinz@gmail.com'];

  useEffect(() => {
    // Escuchar cambios en Firestore
    const docRef = doc(db, "portfolio", "sergio");
    const unsubFirestore = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCvData(docSnap.data());
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Auth Listener
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && adminEmails.includes(currentUser.email)) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        setIsEditing(false);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubAuth();
      unsubFirestore();
    };
  }, []);

  const updateData = async (path, value) => {
    const newData = { ...cvData };
    const keys = path.split('.');
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setCvData(newData);

    // Guardar en Firestore si es admin
    if (isAdmin) {
      try {
        await setDoc(doc(db, "portfolio", "sergio"), newData);
      } catch (error) {
        console.error("Firestore Save Error:", error);
      }
    }
  };

  const login = async () => {
    if (import.meta.env.VITE_FIREBASE_API_KEY === "TU_API_KEY" || !auth.config?.apiKey || auth.config?.apiKey === "TU_API_KEY") {
      alert("Configuración Requerida: Para usar el modo Admin, primero debes configurar tus propias claves de Firebase en src/firebase.js");
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Error de Conexión: Verifica tu configuración de Firebase.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const uploadFile = (file, path) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

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
          <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide items-center">
            {['Experiencia', 'Habilidades', 'Educación', 'Galería', 'Contacto'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className="hover:text-blue-400 transition-colors uppercase"
              >
                {item}
              </button>
            ))}

            {/* Admin Controls */}
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${isEditing ? 'bg-red-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
              >
                {isEditing ? <X size={14} /> : <Plus size={14} />}
                {isEditing ? 'DETENER EDICIÓN' : 'MODO EDICIÓN'}
              </button>
            )}

            {user ? (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
                title="Cerrar Sesión"
              >
                <span className="text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">LOGOUT</span>
                <LogOut size={18} />
              </button>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group"
                title="Acceso Admin"
              >
                <span className="text-[10px] font-bold tracking-widest">ADMIN</span>
                <LogIn size={18} />
              </button>
            )}
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
              <EditableText
                text={cvData.hero.titleLine1}
                onSave={(val) => updateData('hero.titleLine1', val)}
                isEditing={isEditing}
              /> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                <EditableText
                  text={cvData.hero.titleLine2}
                  onSave={(val) => updateData('hero.titleLine2', val)}
                  isEditing={isEditing}
                />
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              <EditableText
                tag="span"
                text={cvData.hero.description}
                onSave={(val) => updateData('hero.description', val)}
                isEditing={isEditing}
              />
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => scrollTo('contacto')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25 flex items-center gap-2"
              >
                <Mail size={18} /> Contáctame
              </button>
              <button
                onClick={() => window.print()}
                className="px-8 py-3 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 font-bold rounded-full transition-all flex items-center gap-2"
              >
                <FileDown size={18} /> Generar CV (PDF)
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

                <ProfileImage
                  url={cvData.hero.profileImage}
                  isEditing={isEditing}
                  onSave={(newUrl) => updateData('hero.profileImage', newUrl)}
                  onUpload={uploadFile}
                />

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
            {cvData.experience.map((item, index) => (
              <div key={index} className="relative group">
                {isEditing && (
                  <button
                    onClick={() => {
                      const newExp = [...cvData.experience];
                      newExp.splice(index, 1);
                      updateData('experience', newExp);
                    }}
                    className="absolute -left-12 top-0 text-red-500 hover:text-red-400 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <TimelineItem
                  {...item}
                  isEditing={isEditing}
                  onSave={(field, val) => {
                    const newExp = [...cvData.experience];
                    newExp[index][field] = val;
                    updateData('experience', newExp);
                  }}
                />
              </div>
            ))}

            {isEditing && (
              <button
                onClick={() => {
                  const newExp = [...cvData.experience, { role: "Nuevo Rol", company: "Compañía", location: "Ubicación", period: "Periodo", description: "Descripción..." }];
                  updateData('experience', newExp);
                }}
                className="ml-8 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-500 transition-all"
              >
                <Plus size={16} /> AÑADIR EXPERIENCIA
              </button>
            )}
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
            {cvData.skills.map((skill, index) => (
              <div key={index} className="relative group">
                {isEditing && (
                  <button
                    onClick={() => {
                      const newSkills = [...cvData.skills];
                      newSkills.splice(index, 1);
                      updateData('skills', newSkills);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full z-20 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                )}
                <SkillCard
                  {...skill}
                  isEditing={isEditing}
                  onSave={(field, val) => {
                    const newSkills = [...cvData.skills];
                    newSkills[index][field] = val;
                    updateData('skills', newSkills);
                  }}
                />
              </div>
            ))}
            {isEditing && (
              <button
                onClick={() => {
                  const newSkills = [...cvData.skills, { title: "Nueva Habilidad", desc: "Descripción..." }];
                  updateData('skills', newSkills);
                }}
                className="p-6 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-blue-500 hover:text-blue-500 transition-all"
              >
                <Plus size={32} />
                <span className="mt-2 font-bold">AÑADIR HABILIDAD</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Galería (Media) */}
      <section id="galeria" className="py-24 relative z-10 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="h-px bg-cyan-500 w-12"></div>
            <h2 className="text-3xl font-bold tracking-tight uppercase">Galería de Trabajo</h2>
            {isEditing && (
              <button
                onClick={() => {
                  const newMedia = [...(cvData.media || []), { title: "Nuevo Item", url: "", type: "image" }];
                  updateData('media', newMedia);
                }}
                className="bg-blue-600 p-2 rounded-full hover:bg-blue-500 ml-4 transition-all"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cvData.media && cvData.media.map((item, index) => (
              <MediaItem
                key={index}
                item={item}
                isEditing={isEditing}
                onDelete={() => {
                  const newMedia = [...cvData.media];
                  newMedia.splice(index, 1);
                  updateData('media', newMedia);
                }}
                onUpdate={(field, val) => {
                  const newMedia = [...cvData.media];
                  newMedia[index][field] = val;
                  updateData('media', newMedia);
                }}
                onUpload={uploadFile}
              />
            ))}

            {isEditing && (
              <button
                onClick={() => {
                  const newMedia = [...(cvData.media || []), { title: "Nuevo Item", url: "", type: "image" }];
                  updateData('media', newMedia);
                }}
                className="border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-500 transition-all aspect-video"
              >
                <Plus size={32} />
                <span className="mt-2 font-bold uppercase text-xs">Añadir Foto/Video</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Educación */}
      <section id="educacion" className="py-24 bg-slate-900/30 border-y border-slate-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">FORMACIÓN ACADÉMICA</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cvData.education.map((edu, index) => (
              <div key={index} className="bg-slate-900 p-8 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition-colors relative group">
                {isEditing && (
                  <button
                    onClick={() => {
                      const newEdu = [...cvData.education];
                      newEdu.splice(index, 1);
                      updateData('education', newEdu);
                    }}
                    className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <EditableText
                  tag="h3"
                  text={edu.title}
                  isEditing={isEditing}
                  onSave={(val) => {
                    const newEdu = [...cvData.education];
                    newEdu[index].title = val;
                    updateData('education', newEdu);
                  }}
                  className="text-xl font-bold text-blue-400 mb-2"
                />
                <EditableText
                  tag="p"
                  text={edu.school}
                  isEditing={isEditing}
                  onSave={(val) => {
                    const newEdu = [...cvData.education];
                    newEdu[index].school = val;
                    updateData('education', newEdu);
                  }}
                  className="text-white font-medium"
                />
                <EditableText
                  tag="p"
                  text={edu.location}
                  isEditing={isEditing}
                  onSave={(val) => {
                    const newEdu = [...cvData.education];
                    newEdu[index].location = val;
                    updateData('education', newEdu);
                  }}
                  className="text-slate-500 text-sm"
                />
              </div>
            ))}
          </div>
          {isEditing && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => {
                  const newEdu = [...cvData.education, { title: "Nuevo Título", school: "Institución", location: "Ubicación" }];
                  updateData('education', newEdu);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold flex items-center gap-2 hover:bg-blue-500 transition-all"
              >
                <Plus size={20} /> AÑADIR EDUCACIÓN
              </button>
            </div>
          )}
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

const EditableText = ({ tag: Tag = 'span', text, onSave, isEditing, className = "" }) => {
  if (isEditing) {
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onSave(e.target.innerText)}
        className={`${className} border-b border-dashed border-blue-500 outline-none focus:border-solid focus:bg-blue-500/10 px-1`}
      >
        {text}
      </Tag>
    );
  }
  return <Tag className={className}>{text}</Tag>;
};

const ProfileImage = ({ url, isEditing, onSave, onUpload }) => {
  const [imgSrc, setImgSrc] = useState(url || 'sergio.jpg');
  const [hasError, setHasError] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImgSrc(url || 'sergio.jpg');
    setHasError(false);
  }, [url]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("https://via.placeholder.com/400x400/0f172a/3b82f6?text=Sergio+Martinez");
    }
  };

  const handleEdit = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploading(true);
        try {
          const downloadURL = await onUpload(file, 'profile');
          onSave(downloadURL);
        } catch (error) {
          console.error("Upload failed", error);
          alert("Error al subir la imagen");
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-slate-800 relative z-10 group-hover:scale-105 transition-transform duration-500 bg-slate-800">
      <img
        src={imgSrc}
        alt="Sergio Martinez"
        onError={handleError}
        className={`w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity ${uploading ? 'animate-pulse blur-sm' : ''}`}
      />
      <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>

      {isEditing && (
        <button
          onClick={handleEdit}
          disabled={uploading}
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
          title="Cambiar Foto de Perfil"
        >
          {uploading ? (
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ImageIcon size={32} className="text-white" />
          )}
        </button>
      )}
    </div>
  );
};

const TimelineItem = ({ role, company, location, period, description, isEditing, onSave }) => (
  <div className="relative pl-8 pb-12 last:pb-0 group">
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-600 group-hover:border-blue-500 group-hover:scale-125 transition-all duration-300 z-10"></div>
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
      <EditableText
        tag="h3"
        text={role}
        isEditing={isEditing}
        onSave={(val) => onSave('role', val)}
        className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors"
      />
      <EditableText
        tag="span"
        text={period}
        isEditing={isEditing}
        onSave={(val) => onSave('period', val)}
        className="text-sm font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800"
      />
    </div>
    <div className="text-blue-500 font-medium mb-3 flex items-center gap-2">
      <EditableText
        text={company}
        isEditing={isEditing}
        onSave={(val) => onSave('company', val)}
      />
      <span className="text-slate-600">•</span>
      <EditableText
        tag="span"
        text={location}
        isEditing={isEditing}
        onSave={(val) => onSave('location', val)}
        className="text-slate-400 text-sm font-normal"
      />
    </div>
    <EditableText
      tag="p"
      text={description}
      isEditing={isEditing}
      onSave={(val) => onSave('description', val)}
      className="text-slate-400 leading-relaxed w-full"
    />
  </div>
);

const SkillCard = ({ title, desc, isEditing, onSave }) => (
  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:bg-slate-800 hover:border-blue-500/50 group transition-all duration-300 cursor-default">
    <div className="w-12 h-12 rounded-lg bg-slate-950 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
      <Clapperboard size={24} />
    </div>
    <EditableText
      tag="h3"
      text={title}
      isEditing={isEditing}
      onSave={(val) => onSave('title', val)}
      className="text-lg font-bold text-white mb-2 block"
    />
    <EditableText
      tag="p"
      text={desc}
      isEditing={isEditing}
      onSave={(val) => onSave('desc', val)}
      className="text-slate-400 text-sm block"
    />
  </div>
);

const MediaItem = ({ item, isEditing, onDelete, onUpdate, onUpload }) => {
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploading(true);
        try {
          const type = file.type.startsWith('video') ? 'video' : 'image';
          const downloadURL = await onUpload(file, 'media');
          onUpdate('url', downloadURL);
          onUpdate('type', type);
        } catch (error) {
          console.error("Upload failed", error);
          alert("Error al subir el archivo");
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl aspect-video bg-slate-900 border border-slate-800">
      {item.type === 'video' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 overflow-hidden">
          {item.url ? (
            <video src={item.url} className="w-full h-full object-cover" />
          ) : (
            <Video size={48} className="text-slate-700" />
          )}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
          {item.url ? (
            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={48} className="text-slate-700" />
          )}
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-blue-400">SUBIENDO...</span>
          </div>
        </div>
      )}

      {isEditing && (
        <>
          <button
            onClick={onDelete}
            className="absolute top-4 right-4 bg-red-500 p-2 rounded-full hover:bg-red-600 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={handleUploadClick}
            className="absolute top-4 left-4 bg-blue-600 p-2 rounded-full hover:bg-blue-500 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Subir Archivo"
          >
            <Camera size={16} />
          </button>
        </>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 to-transparent z-10">
        <EditableText
          text={item.title}
          isEditing={isEditing}
          onSave={(val) => onUpdate('title', val)}
          className="text-sm font-bold block"
        />
        {isEditing && (
          <div className="flex items-center gap-2 mt-1">
            <EditableText
              text={item.url || "O subir archivo..."}
              isEditing={isEditing}
              onSave={(val) => onUpdate('url', val)}
              className="text-[10px] text-slate-500 block truncate flex-1"
            />
            <span className="text-[10px] uppercase font-bold text-slate-700">{item.type}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;