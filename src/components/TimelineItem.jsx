import React from 'react';
import EditableText from './EditableText';

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

  export default TimelineItem;