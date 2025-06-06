import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

export default function ServicesLayout({ content = {}, isEditing, onContentChange }) {
  const defaultServices = [
    { title: 'Web Development', description: 'Building responsive and scalable websites.' },
    { title: 'UI/UX Design', description: 'Designing intuitive and beautiful user interfaces.' },
    { title: 'SEO Optimization', description: 'Improving visibility in search engines.' },
  ];

  const [localData, setLocalData] = useState({
    sectionTitle: content.sectionTitle || 'Our Services',
    services: content.services || defaultServices,
  });

  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    setLocalData({
      sectionTitle: content.sectionTitle || 'Our Services',
      services: content.services || defaultServices,
    });
  }, [content]);

  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  const handleChange = (field, index = null) => (e) => {
    const value = e.target.value;
    if (index !== null) {
      const updatedServices = [...localData.services];
      updatedServices[index] = { ...updatedServices[index], [field]: value };
      setLocalData({ ...localData, services: updatedServices });
    } else {
      setLocalData({ ...localData, [field]: value });
    }
  };

  const handleAddService = () => {
    setLocalData({
      ...localData,
      services: [...localData.services, { title: '', description: '' }],
    });
  };

  const handleDeleteService = (index) => {
    const updatedServices = localData.services.filter((_, i) => i !== index);
    setLocalData({ ...localData, services: updatedServices });
  };

  const renderEditableField = ({ value, fieldKey, type = 'text', index = null }) => {
    const isEditingThis = editingField === `${fieldKey}-${index ?? 'main'}`;
    return (
      <div className="relative group w-full" onClick={() => isEditing && setEditingField(`${fieldKey}-${index ?? 'main'}`)}>
        {isEditing && isEditingThis ? (
          <div className="flex flex-col gap-2">
            {type === 'textarea' ? (
              <textarea
                className="w-full border p-2 rounded focus:outline-blue-500 text-gray-900 dark:text-white dark:bg-gray-800"
                value={value}
                onChange={handleChange(fieldKey, index)}
                rows={3}
                autoFocus
              />
            ) : (
              <input
                className="w-full border-b p-1 focus:outline-blue-500 bg-transparent text-gray-900 dark:text-white dark:bg-gray-800"
                type="text"
                value={value}
                onChange={handleChange(fieldKey, index)}
                autoFocus
              />
            )}
            <div className="flex gap-2">
              <button
                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
              >
                <FaSave />
              </button>
              <button
                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalData(content); // Reset to original
                  setEditingField(null);
                }}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full text-gray-900 dark:text-white">
            <span className="block">{value}</span>
            {isEditing && (
              <FaEdit className="absolute top-0 right-0 text-gray-400 dark:text-gray-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900 text-center text-gray-900 dark:text-white">
      <div className="container mx-auto max-w-4xl px-4">
        <h2 className="text-4xl font-bold mb-10">
          {renderEditableField({
            value: localData.sectionTitle,
            fieldKey: 'sectionTitle',
          })}
        </h2>
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8 text-left">
          {localData.services.map((service, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 group relative">
              {isEditing && (
                <button
                  onClick={() => handleDeleteService(index)}
                  title="Delete Service"
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {renderEditableField({
                  value: service.title,
                  fieldKey: 'title',
                  index,
                })}
              </h3>
              <div className="text-gray-700 dark:text-gray-300">
                {renderEditableField({
                  value: service.description,
                  fieldKey: 'description',
                  type: 'textarea',
                  index,
                })}
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-10">
            <button
              onClick={handleAddService}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Add Service
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
