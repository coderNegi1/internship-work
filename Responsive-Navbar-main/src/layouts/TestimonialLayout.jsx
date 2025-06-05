import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave } from 'react-icons/fa';

export default function TestimonialLayout({ content = {}, isEditing, editData = {}, setEditData }) {
  const [localData, setLocalData] = useState(editData);
  const [editingField, setEditingField] = useState(null);

  // Consolidated ref for image inputs, indexed by field name
  const fileInputRefs = {
    authorPhoto: useRef(null),
    companyLogo: useRef(null),
  };

  // Keep localData in sync with editData prop
  useEffect(() => {
    setLocalData(editData);
  }, [editData]);

  // Handle changes for text and textarea fields
  const handleChange = (field) => (e) => {
    const updatedData = { ...localData, [field]: e.target.value };
    setLocalData(updatedData);
    setEditData(updatedData); // Propagate changes up
  };

  // Handle image file changes
  const handleImageChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedData = { ...localData, [field]: reader.result };
      setLocalData(updatedData);
      setEditData(updatedData); // Propagate changes up
      setEditingField(null); // Exit editing mode after upload
    };
    reader.readAsDataURL(file);
  };

  // Programmatically click hidden file input
  const triggerImageUpload = (field) => {
    fileInputRefs[field].current?.click();
  };

  // Reusable render function for editable fields
  const renderEditableField = (fieldKey, element, type = 'text') => {
    const isEditingThis = editingField === fieldKey;
    const value = localData[fieldKey] ?? content[fieldKey] ?? '';

    // If not in editing mode, clicking the field itself triggers edit
    const handleClick = () => {
      if (isEditing && !isEditingThis) {
        setEditingField(fieldKey);
      }
    };

    return (
      <div
        className="relative inline-block group" // Added group class for hover effects
        onClick={handleClick} // Click on the div triggers edit mode
      >
        {isEditingThis ? (
          <div className="flex items-center">
            {type === 'text' && (
              <input
                type="text"
                value={value}
                onChange={handleChange(fieldKey)}
                className="border-b border-blue-500 bg-transparent focus:outline-none"
                autoFocus
              />
            )}
            {type === 'textarea' && (
              <textarea
                value={value}
                onChange={handleChange(fieldKey)}
                className="border p-2 rounded resize-y focus:outline-blue-500"
                rows={3}
                autoFocus
              />
            )}
            {type === 'image' && (
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange(fieldKey)}
                  ref={fileInputRefs[fieldKey]}
                  className="hidden"
                />
                <button
                  onClick={() => triggerImageUpload(fieldKey)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <FaUpload /> Upload Image
                </button>
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setEditingField(null); }} // Stop propagation to prevent re-entering edit mode
              className="ml-2 text-green-600 hover:text-green-800"
              aria-label="Save"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="relative">
            {element}
            {isEditing && ( // Only show edit icon if isEditing is true
              <FaEdit
                className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0  transition-opacity cursor-pointer"
                onClick={(e) => { e.stopPropagation(); setEditingField(fieldKey); }} // Click edit icon to specifically trigger edit
                aria-label={`Edit ${fieldKey}`}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 mt-8 md:mt-24 gap-12">
      {/* Left: Testimonial Text */}
      <div className="max-w-lg">
        {/* Quote */}
        <blockquote className="text-xl italic text-gray-700 mb-6">
          {renderEditableField(
            'quote',
            <p>{localData.quote ?? content.quote ?? 'This product changed the way we work!'}</p>,
            'textarea'
          )}
        </blockquote>

        {/* Author Name */}
        <div className="font-semibold text-lg mb-1">
          {renderEditableField(
            'authorName',
            <span>{localData.authorName ?? content.authorName ?? 'John Doe'}</span>
          )}
        </div>

        {/* Author Title */}
        <div className="text-gray-500 mb-4">
          {renderEditableField(
            'authorTitle',
            <span>{localData.authorTitle ?? content.authorTitle ?? 'CEO, Company Inc.'}</span>
          )}
        </div>

        {/* Company Logo */}
        <div className="max-w-xs">
          {(localData.companyLogo || content.companyLogo) &&
            renderEditableField(
              'companyLogo',
              <img
                className="max-h-12 object-contain"
                src={localData.companyLogo ?? content.companyLogo}
                alt="Company Logo"
                loading="lazy"
              />,
              'image'
            )}
        </div>
      </div>

     {/* Right: Author Photo */ }
      <div
        className="w-48 h-48 overflow-hidden shadow-lg flex items-center justify-center bg-gray-100 relative group"
        onClick={() => isEditing && setEditingField('authorPhoto')} // Click anywhere on the div to edit
      >
        {(localData.authorPhoto || content.authorPhoto) ? (
          <img
            className="w-full h-full object-cover"
            src={localData.authorPhoto ?? content.authorPhoto}
            alt="Author"
            loading="lazy"
          />
        ) : (
          <div className="text-gray-400">No Photo</div>
        )}

        {/* Edit button in center on hover for authorPhoto */}
        {isEditing && editingField !== 'authorPhoto' && (
          <button
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-lg opacity-0 group-hover:opacity-100 transition"
            aria-label="Edit Author Photo"
            onClick={(e) => { // Add onClick handler to this button
              e.stopPropagation(); // Prevent the parent div's onClick from firing
              setEditingField('authorPhoto'); // Set editing field to trigger the upload interface
              // No need to trigger file input here, as it's handled by the new logic when editingField is 'authorPhoto'
            }}
          >
            <FaEdit />
          </button>
        )}

        {/* Upload interface if authorPhoto is being edited */}
        {editingField === 'authorPhoto' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange('authorPhoto')}
              ref={fileInputRefs.authorPhoto}
              className="hidden"
            />
            {/* The following button will now trigger the file input directly */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRefs.authorPhoto.current.click(); // Directly trigger the hidden file input
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-2"
            >
              <FaUpload /> Upload Image
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setEditingField(null); }} // Stop propagation
              className="text-green-600 hover:text-green-800"
              aria-label="Save"
            >
              <FaSave />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}