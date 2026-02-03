import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

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
      input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          setUploading(true);
          try {
            const downloadURL = await onUpload(file, 'profile');
            onSave(downloadURL);
          } catch (error) {
            console.error("Upload failed", error);
            // El error ya fue mostrado en uploadFile
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
          <>
            <button
              onClick={handleEdit}
              disabled={uploading}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
              title="Cambiar Foto de Perfil"
            >
              {uploading ? (
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ImageIcon size={32} className="text-white mb-2" />
                  <span className="text-xs text-white/80">JPG, PNG, GIF, WebP</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    );
  };

  export default ProfileImage;