import React from 'react';
import { Clapperboard } from 'lucide-react';
import EditableText from './EditableText';

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

  export default SkillCard;