import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaPlusCircle } from 'react-icons/fa';

export default function FullPageGridLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState(content);
  const [editingField, setEditingField] = useState(null);

  const fileInputRefs = {
    gridImage: useRef(null),
  };

  // Keep localData in sync with the content prop
  useEffect(() => {
    setLocalData(content);
  }, [content]);

  // Propagate changes up to a parent handler if provided
  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  // Handle changes for text and textarea fields
  const handleChange = (field) => (e) => {
    const updatedData = { ...localData, [field]: e.target.value };
    setLocalData(updatedData);
  };

  // Handle image file changes
  const handleImageChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setEditingField(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedData = { ...localData, [field]: reader.result };
      setLocalData(updatedData);
      setEditingField(null);
    };
    reader.readAsDataURL(file);
  };

  // Programmatically click hidden file input
  const triggerImageUpload = (field) => {
    fileInputRefs[field].current?.click();
  };

  // Reusable render function for editable fields
  const renderEditableField = (fieldKey, element, type = 'text', customClasses = '') => {
    const isEditingThis = editingField === fieldKey;
    const value = localData[fieldKey] ?? content[fieldKey] ?? '';
    const hasImage = (localData[fieldKey] || content[fieldKey]);

    const handleClick = (e) => {
      if (type === 'image' && isEditing && !isEditingThis) {
        e.stopPropagation();
      } else if (isEditing && !isEditingThis) {
        setEditingField(fieldKey);
      }
    };

    return (
      <div
        className={`relative inline-block group ${customClasses}`}
        onClick={handleClick}
      >
        {isEditingThis ? (
          <div className="flex flex-col items-center justify-center w-full">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={handleChange(fieldKey)}
                className="border-b border-green-500 bg-transparent focus:outline-none w-full p-1 text-black"
                autoFocus
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={handleChange(fieldKey)}
                className="border p-2 rounded resize-y focus:outline-green-500 w-full text-black"
                rows={Math.max(3, (value.split('\n').length))}
                autoFocus
              />
            )}
            {type === 'image' && (
              <div className="flex flex-col items-center w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(fieldKey)}
                  ref={fileInputRefs[fieldKey]}
                  className="hidden"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); triggerImageUpload(fieldKey); }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-2"
                >
                  <FaUpload /> {hasImage ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
              className="text-green-700 hover:text-green-900 flex-shrink-0 p-1"
              aria-label="Save"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {element}

            {isEditing && type === 'image' && !hasImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingField(fieldKey);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors duration-200 text-xl rounded-lg cursor-pointer"
                aria-label="Add Image"
              >
                <FaPlusCircle className="text-4xl mb-2" />
                Add Image
              </button>
            )}

            {isEditing && (type !== 'image' || hasImage) && (
              <FaEdit
                className={`absolute ${type === 'image' ? 'inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100' : 'top-0 right-0 text-gray-400 hover:text-green-600 opacity-0 group-hover:opacity-100'} transition-opacity cursor-pointer`}
                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }}
                aria-label={`Edit ${fieldKey}`}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      className="relative text-white py-20 overflow-hidden min-h-[400px] flex items-center"
      style={{ background: 'linear-gradient(to right, #4ade80, #22c55e)' }} // green gradient background
    >
      <div className="absolute inset-0 z-0">
        {(localData.gridImage || content.gridImage) ? (
          <img
            src={localData.gridImage ?? content.gridImage}
            alt="Services Section Image"
            className="w-full h-full object-cover opacity-50 border"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 opacity-50 flex items-center justify-center"></div>
        )}
        {renderEditableField(
          'gridImage',
          null,
          'image',
          'absolute inset-0 z-10'
        )}
      </div>
      <div className="container mx-auto px-6 relative z-20 text-center flex flex-col">
        {renderEditableField(
          'gridTitle',
          <h1 className="text-5xl font-extrabold mb-4">{localData.gridTitle ?? content.gridTitle ?? 'Services'}</h1>, // changed text default
          'text',
          'block'
        )}
        {renderEditableField(
          'gridSubtitle',
          <p className="text-xl max-w-2xl mx-auto">{localData.gridSubtitle ?? content.gridSubtitle ?? 'We are a dedicated team committed to innovation and excellence.'}</p>,
          'textarea',
          'block'
        )}
      </div>
    </section>
  );
}
