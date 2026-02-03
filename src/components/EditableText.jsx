import React from 'react';

const EditableText = ({ tag, text, onSave, isEditing, className = "" }) => {
    const Component = tag || 'span';
    if (isEditing) {
      return (
        <Component
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onSave(e.target.innerText)}
          className={`${className} border-b border-dashed border-blue-500 outline-none focus:border-solid focus:bg-blue-500/10 px-1`}
        >
          {text}
        </Component>
      );
    }
    return <Component className={className}>{text}</Component>;
  };

  export default EditableText;