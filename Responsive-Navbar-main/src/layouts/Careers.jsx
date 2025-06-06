import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaSave, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function Careers({ isEditing, editData = {}, setEditData }) {
  const defaultData = {
    title: 'Join Our Team',
    description:
      'We are looking for passionate individuals to grow with us. Check out our open positions and apply today!',
    profileImage: '',
    backgroundColor: '',
    jobOpenings: [
      {
        title: 'Frontend Developer',
        location: 'Remote',
        description:
          'Build and maintain user interfaces with React and Tailwind CSS.',
      },
      {
        title: 'Backend Engineer',
        location: 'New York, NY',
        description: 'Develop scalable APIs and work with databases.',
      },
    ],
  };

  const [localData, setLocalData] = useState(editData.title ? editData : defaultData);
  const [editingField, setEditingField] = useState(null);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [tempImagePreview, setTempImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (JSON.stringify(editData) !== JSON.stringify(localData)) {
      setLocalData(editData.title ? editData : defaultData);
      setTempImagePreview(null);
      setTempImageFile(null);
    }
  }, [editData]);

  const handleChange = (field) => (e) => {
    const updated = { ...localData, [field]: e.target.value };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleJobChange = (index, field) => (e) => {
    const updatedJobs = [...localData.jobOpenings];
    updatedJobs[index][field] = e.target.value;
    const updated = { ...localData, jobOpenings: updatedJobs };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleAddJob = () => {
    const updated = {
      ...localData,
      jobOpenings: [
        ...localData.jobOpenings,
        { title: '', location: '', description: '' },
      ],
    };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleDeleteJob = (index) => {
    const updatedJobs = localData.jobOpenings.filter((_, i) => i !== index);
    const updated = { ...localData, jobOpenings: updatedJobs };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTempImageFile(file);
      setTempImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setTempImageFile(null);
    setTempImagePreview(null);
    const updated = { ...localData, profileImage: '' };
    setLocalData(updated);
    setEditData(updated);
  };

  async function uploadImageToServer(file) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), 1500);
    });
  }

  async function handleSaveAll() {
    try {
      setIsSaving(true);

      let profileImageUrl = localData.profileImage;

      if (tempImageFile) {
        profileImageUrl = await uploadImageToServer(tempImageFile);
      }

      const finalData = {
        ...localData,
        profileImage: profileImageUrl,
      };

      await new Promise((r) => setTimeout(r, 1000));

      setLocalData(finalData);
      setEditData(finalData);

      setTempImageFile(null);
      setTempImagePreview(null);
      setIsSaving(false);
      alert('Career page saved successfully!');
    } catch (error) {
      setIsSaving(false);
      alert('Error saving data: ' + error.message);
    }
  }

  const renderEditableField = (value, onChange, fieldId, type = 'text', className = '') => {
    const isEditingThis = editingField === fieldId;
    return isEditing ? (
      isEditingThis ? (
        <div className="relative">
          {type === 'textarea' ? (
            <textarea
              className={`w-full p-2 border rounded text-black ${className}`}
              value={value}
              onChange={onChange}
              rows={3}
              autoFocus
            />
          ) : (
            <input
              className={`w-full p-2 border-b text-black ${className}`}
              value={value}
              onChange={onChange}
              autoFocus
            />
          )}
          <div className="flex gap-3 mt-1">
            <button onClick={() => setEditingField(null)} className="text-green-600" aria-label="Save field">
              <FaSave />
            </button>
            <button onClick={() => setEditingField(null)} className="text-red-500" aria-label="Cancel edit">
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative group cursor-pointer text-gray-900 ${className}`}
          onClick={() => setEditingField(fieldId)}
        >
          {type === 'textarea' ? (
            <p className="text-sm text-gray-700">{value || 'Click to edit'}</p>
          ) : (
            <h3 className="text-lg">{value || 'Click to edit'}</h3>
          )}
          <FaEdit className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition" />
        </div>
      )
    ) : type === 'textarea' ? (
      <p className={`text-sm text-gray-700 ${className}`}>{value}</p>
    ) : (
      <h3 className={`text-lg text-gray-900 ${className}`}>{value}</h3>
    );
  };

  return (
    <section className="py-20 px-8 max-w-5xl mx-auto rounded-lg">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-10 mb-12">
        {/* Left: Profile image */}
        <div className="flex-shrink-0 relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300 cursor-pointer">
          <img
            src={tempImagePreview || localData.profileImage || 'https://via.placeholder.com/150?text=Profile'}
            alt="Profile"
            className="object-cover w-full h-full"
            onClick={() => isEditing && fileInputRef.current?.click()}
          />
          {isEditing && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 z-20"
                aria-label="Delete profile image"
              >
                <FaTrash size={14} />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {/* Right: Title & description */}
        <div className="flex-1">
          {isEditing ? (
            <input
              className="text-3xl w-full bg-transparent border-b mb-4 text-gray-900 font-normal"
              value={localData.title}
              onChange={handleChange('title')}
            />
          ) : (
            <h1 className="text-3xl text-gray-900 font-normal">{localData.title}</h1>
          )}
          {renderEditableField(localData.description, handleChange('description'), 'description', 'textarea', 'mt-2 text-base')}
        </div>
      </div>

      {/* Job Openings */}
      <div>
        <h2 className="text-2xl mb-6 text-gray-900 font-normal">Job Openings</h2>
        <div className="space-y-6">
          {localData.jobOpenings.map((job, index) => (
            <div key={index} className="relative">
              {isEditing && (
                <button
                  onClick={() => handleDeleteJob(index)}
                  className="absolute top-1 right-8 text-red-500 hover:text-red-700 z-10"
                  aria-label={`Delete job opening ${job.title}`}
                >
                  <FaTrash />
                </button>
              )}
              {renderEditableField(job.title, handleJobChange(index, 'title'), `job-title-${index}`, 'text', 'text-lg font-normal text-gray-900')}
              {renderEditableField(job.location, handleJobChange(index, 'location'), `job-location-${index}`, 'text', 'text-sm font-normal text-gray-700')}
              {renderEditableField(job.description, handleJobChange(index, 'description'), `job-desc-${index}`, 'textarea', 'mt-1 text-gray-700')}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="mt-8 text-center">
            <button
              onClick={handleAddJob}
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 inline-flex items-center gap-3 font-semibold"
            >
              <FaPlus /> Add Job
            </button>
          </div>
        )}
      </div>

      {/* Save button */}
      {isEditing && (
        <div className="mt-12 text-center">
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded ${
              isSaving ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <FaSave />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}
    </section>
  );
}
