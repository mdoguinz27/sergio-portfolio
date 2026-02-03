import React from 'react';

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

  export default EditableText;