import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function EditableBlogSection({ isEditing, editData = {}, setEditData }) {
    const defaultImage = "https://via.placeholder.com/600x400?text=No+Image";

  const defaultData = {
    sectionTitle: 'Latest Blog Posts',
    blogs: [
      {
        title: 'How AI is Shaping the Future',
        summary: 'An in-depth look at how artificial intelligence is transforming industries.',
        imageUrl: '',
      },
      {
        title: 'Design Trends in 2025',
        summary: 'A visual guide to UI/UX trends emerging this year.',
        imageUrl: '',
      },
    ],
  };

  const [localData, setLocalData] = useState(editData.blogs ? editData : defaultData);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (JSON.stringify(editData) !== JSON.stringify(localData)) {
      setLocalData(editData.blogs ? editData : defaultData);
    }
  }, [editData]);

  const handleChange = (index, field) => (e) => {
    const updatedBlogs = [...localData.blogs];
    updatedBlogs[index][field] = e.target.value;
    const updated = { ...localData, blogs: updatedBlogs };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleImageUpload = (index) => (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file); // for preview
    const updatedBlogs = [...localData.blogs];
    updatedBlogs[index].imageUrl = imageUrl;
    const updated = { ...localData, blogs: updatedBlogs };

    setLocalData(updated);
    setEditData(updated);
  };

  const handleSectionTitleChange = (e) => {
    const updated = { ...localData, sectionTitle: e.target.value };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleAddBlog = () => {
    const updated = {
      ...localData,
      blogs: [
        ...localData.blogs,
        { title: '', summary: '', imageUrl: '' },
      ],
    };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleDeleteBlog = (index) => {
    const updatedBlogs = localData.blogs.filter((_, i) => i !== index);
    const updated = { ...localData, blogs: updatedBlogs };
    setLocalData(updated);
    setEditData(updated);
  };
  const handleDeleteImage = (index) => {
  const updatedBlogs = [...localData.blogs];
  updatedBlogs[index].imageUrl = '';
  const updated = { ...localData, blogs: updatedBlogs };
  setLocalData(updated);
  setEditData(updated);
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
          <button onClick={() => setEditingField(null)} className="text-green-600">
            <FaSave />
          </button>
          <button onClick={() => setEditingField(null)} className="text-red-500">
            <FaTimes />
          </button>
        </div>
      </div>
    ) : (
      <div
        className="relative group cursor-pointer"
        onClick={() => isEditing && setEditingField(fieldId)}
      >
        {type === 'textarea' ? (
          <p className="text-sm text-gray-700 dark:text-gray-300">{value}</p>
        ) : (
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value}</h3>
        )}
        {isEditing && (
          <FaEdit className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition" />
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-10">
          {isEditing ? (
            <input
              className="text-3xl font-bold text-center w-full bg-transparent border-b text-black dark:text-white mb-4"
              value={localData.sectionTitle}
              onChange={handleSectionTitleChange}
            />
          ) : (
            <h2 className="text-4xl font-bold">{localData.sectionTitle}</h2>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {localData.blogs.map((blog, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 relative">
              {isEditing && (
                <button
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteBlog(index)}
                >
                  <FaTrash />
                </button>
              )}

              {renderEditableField(blog.title, handleChange(index, 'title'), `title-${index}`)}
              {renderEditableField(blog.summary, handleChange(index, 'summary'), `summary-${index}`, 'textarea')}

              
                <div className="mt-4 relative group">
                {isEditing ? (
                  <>
                 <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload(index)}
        className="block mb-2 text-sm"
      />
      {(blog.imageUrl || defaultImage) && (
        <div className="relative inline-block w-full">
          <img
            src={blog.imageUrl || defaultImage}
            alt={`Blog ${index}`}
            className="w-full rounded shadow"
          />
          <button
            onClick={() => handleDeleteImage(index)}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <FaTrash size={12} />
          </button>
        </div>
      )}
    </>
  ) : (
    (blog.imageUrl || defaultImage) && (
      <img
        src={blog.imageUrl || defaultImage}
        alt={blog.title}
        className="w-full mt-4 rounded shadow"
      />
    )
  )}
</div>

            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-10 text-center">
            <button
              onClick={handleAddBlog}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              <FaPlus className="inline mr-2" /> Add Blog
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
