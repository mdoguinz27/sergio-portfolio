import React, { useState } from 'react';
import { Plus, Trash2, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

const GallerySection = ({ media = [], isAdmin, onUpdate }) => {
    const [newImageUrl, setNewImageUrl] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleAddImage = (e) => {
        e.preventDefault();
        if (!newImageUrl.trim()) return;

        // Basic validation
        // In a real app we might check regex but here we trust the user/admin
        const updatedMedia = [...media, {
            url: newImageUrl,
            id: Date.now(),
            type: 'image' // Future proofing
        }];

        onUpdate(updatedMedia);
        setNewImageUrl('');
    };

    const handleDeleteImage = (id) => {
        if (window.confirm('¿Eliminar esta imagen?')) {
            const updatedMedia = media.filter(item => item.id !== id);
            onUpdate(updatedMedia);
        }
    };

    return (
        <section id="galeria" className="py-24 relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-3 mb-12">
                    <div className="h-px bg-blue-500 w-12"></div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">GALERÍA VISUAL</h2>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                    <div className="mb-12 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-sm">
                        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                            <Plus size={20} /> Añadir Nueva Imagen
                        </h3>
                        <form onSubmit={handleAddImage} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                placeholder="Pega el enlace de la imagen aquí (https://...)"
                                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                autoFocus
                            />
                            <button
                                type="submit"
                                disabled={!newImageUrl}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> AÑADIR
                            </button>
                        </form>
                        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                            <ExternalLink size={12} />
                            Recomendación: Usa enlaces directos de servicios como Imgur, Cloudinary, o Unsplash.
                        </p>
                    </div>
                )}

                {/* Grid */}
                {media.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
                        <div className="inline-flex p-4 rounded-full bg-slate-800 mb-4">
                            <ImageIcon size={32} className="text-slate-600" />
                        </div>
                        <p className="text-slate-500">No hay imágenes en la galería aún.</p>
                        {isAdmin && <p className="text-blue-400 text-sm mt-2">¡Añade algunas arriba!</p>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {media.map((item) => (
                            <div
                                key={item.id}
                                className="group relative aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-800 hover:border-blue-500/50 transition-all duration-300"
                            >
                                <img
                                    src={item.url}
                                    alt="Gallery Item"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    onClick={() => setSelectedImage(item.url)}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/640x360?text=Error+Cargando+Imagen";
                                    }}
                                />

                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer flex items-end justify-between p-4"
                                    onClick={() => setSelectedImage(item.url)}
                                >
                                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                        Ver Imagen completa
                                    </span>
                                </div>

                                {isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteImage(item.id);
                                        }}
                                        className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm transition-all transform translate-y-[-100%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                                        title="Eliminar imagen"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Full view"
                        className="max-w-full max-h-[90vh] rounded-lg shadow-2xl shadow-blue-900/20"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default GallerySection;
