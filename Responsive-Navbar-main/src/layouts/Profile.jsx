import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function Profile({ isEditing, editData = {}, setEditData }) {
  const defaultData = {
    name: 'John Doe',
    title: 'Software Engineer',
    bio: 'A passionate developer with a love for clean code and innovative solutions.',
    imageUrl: '',
  };

  const [localData, setLocalData] = useState(editData.name ? editData : defaultData);
  const [editingField, setEditingField] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(localData.imageUrl);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (field) => (e) => {
    const updated = { ...localData, [field]: e.target.value };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setImageFile(file);
  };

  const handleSave = () => {
    const updated = { ...localData, imageUrl: previewUrl };
    setEditData(updated);
    setEditingField(null);

    // Simulate upload to server
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      // Send formData to server using fetch or axios
      // fetch('/api/upload', { method: 'POST', body: formData });
    }
  };

  const renderEditableField = (value, onChange, fieldId, type = 'text') => {
    const isEditingThis = editingField === fieldId;
    return isEditing && isEditingThis ? (
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            className="w-full p-2 border rounded text-black"
            value={value}
            onChange={onChange}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            className="w-full p-2 border-b text-black"
            value={value}
            onChange={onChange}
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-1">
          <button onClick={handleSave} className="text-green-600"><FaSave /></button>
          <button onClick={() => setEditingField(null)} className="text-red-500"><FaTimes /></button>
        </div>
      </div>
    ) : (
      <div className="relative group cursor-pointer" onClick={() => isEditing && setEditingField(fieldId)}>
        {type === 'textarea' ? (
          <p className="text-base text-gray-800">{value}</p>
        ) : (
          <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
        )}
        {isEditing && (
          <FaEdit className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-500 transition" />
        )}
      </div>
    );
  };

  return (
    <section className="py-16" style={{ backgroundColor: backgroundColor || 'transparent' }}>
      <div className="container mx-auto max-w-4xl px-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <img
              src={previewUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border border-gray-300"
            />
            {isEditing && (
              <div className="absolute bottom-0 right-0 bg-white border rounded-full p-1 shadow">
                <label className="cursor-pointer text-blue-600 text-sm">
                  <FaEdit />
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>
              </div>
            )}
          </div>

          {renderEditableField(localData.name, handleChange('name'), 'name')}
          {renderEditableField(localData.title, handleChange('title'), 'title')}
          {renderEditableField(localData.bio, handleChange('bio'), 'bio', 'textarea')}

          {isEditing && (
            <div className="mt-4">
              <label className="block mb-1 font-medium">Background Color</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-8 p-0 border rounded"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
