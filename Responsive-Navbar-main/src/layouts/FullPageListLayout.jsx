import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function FullPageListLayout({ content = {}, isEditing, onContentChange }) {
  const [localData, setLocalData] = useState({
    leftTitle: 'Get in Touch with Us',
    leftSubtitle: 'We’re here to assist you with:',
    bullets: ['Discussing your use case', 'Answering any queries', 'Exploring our pricing options'],
    formFields: [
      { label: 'First Name' },
      { label: 'Last Name' },
      { label: 'Work Email' },
      { label: 'Phone Number' },
      { label: 'Company' },
      { label: 'Message' }
    ],
    ...content,
  });

  const [editing, setEditing] = useState({ type: null, index: null });
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    setLocalData({
      leftTitle: 'Get in Touch with Us',
      leftSubtitle: 'We’re here to assist you with:',
      bullets: ['Discussing your use case', 'Answering any queries', 'Exploring our pricing options'],
      formFields: [
        { label: 'First Name' },
        { label: 'Last Name' },
        { label: 'Work Email' },
        { label: 'Phone Number' },
        { label: 'Company' },
        { label: 'Message' }
      ],
      ...content,
    });
  }, [content]);

  useEffect(() => {
    onContentChange?.(localData);
  }, [localData]);

  const handleInputChange = (index) => (e) => {
  const updated = { ...formValues, [localData.formFields[index].label]: e.target.value };
  setFormValues(updated);
};

const handleSubmit = () => {
  // Save to localStorage
  localStorage.setItem('contactFormSubmission', JSON.stringify(formValues));

  // Show alert
  alert('Details sent successfully. We will contact you shortly.');

  // Reset form
  setFormValues({});
};

  const handleFieldChange = (key, index = null) => (e) => {
    if (key === 'bullets') {
      const updatedBullets = [...localData.bullets];
      updatedBullets[index] = e.target.value;
      setLocalData({ ...localData, bullets: updatedBullets });
    } else if (key === 'formFields') {
      const updatedFields = [...localData.formFields];
      updatedFields[index].label = e.target.value;
      setLocalData({ ...localData, formFields: updatedFields });
    } else {
      setLocalData({ ...localData, [key]: e.target.value });
    }
  };

  const renderEditable = (value, onChange) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border-b border-blue-500 focus:outline-none bg-transparent p-1"
      autoFocus
    />
  );

  return (
    <section className="py-10 px-4 md:px-5 bg-white">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Left Section */}
      <div
  className="flex flex-col justify-center h-full p-10 text-black"
  style={{
    backgroundImage: `url("https://ctwebsite2025.blob.core.windows.net/media/celebalwebsite2025/assets_webp/common/contact-us-bg.webp")`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center',
    width: '100%',
    height: '100%',
  }}
>
  <div className=" p-6 rounded-lg">
    <h2 className="text-xl text-blue-400">
      {isEditing && editing.type === 'leftTitle'
        ? renderEditable(localData.leftTitle, handleFieldChange('leftTitle'))
        : (
          <span onClick={() => isEditing && setEditing({ type: 'leftTitle' })}>
            {localData.leftTitle}
          </span>
        )}
    </h2>
    <h1 className="text-4xl font-bold text-black mt-2">
      {isEditing && editing.type === 'leftSubtitle'
        ? renderEditable(localData.leftSubtitle, handleFieldChange('leftSubtitle'))
        : (
          <span onClick={() => isEditing && setEditing({ type: 'leftSubtitle' })}>
            {localData.leftSubtitle}
          </span>
        )}
    </h1>
    <ul className="space-y-3 mt-6">
      {localData.bullets.map((text, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-blue-400 text-lg">✔</span>
          {isEditing && editing.type === 'bullets' && editing.index === i
            ? renderEditable(text, handleFieldChange('bullets', i))
            : (
              <span
                className="cursor-pointer"
                onClick={() => isEditing && setEditing({ type: 'bullets', index: i })}
              >
                {text}
              </span>
            )}
        </li>
      ))}
    </ul>
  </div>
</div>


     {/* Right Section - Contact Form */}
<div className="w-full flex flex-col items-center">
  <h1 className="text-3xl font-bold text-center mb-6">Talk to us</h1>
  <div className="space-y-4 w-full">
    <div className="grid sm:grid-cols-2 gap-4">
      {localData.formFields.map((field, index) => (
        <div key={index} className="relative group">
          {isEditing && editing.type === 'formField' && editing.index === index ? (
            renderEditable(field.label, handleFieldChange('formFields', index))
          ) : (
            <label
              className="block text-sm font-medium text-gray-700 cursor-pointer"
              onClick={() => isEditing && setEditing({ type: 'formField', index })}
            >
              {field.label}
            </label>
          )}
          <input
            type={
              field.label.toLowerCase().includes('email') ? 'email' :
              field.label.toLowerCase().includes('phone') ? 'tel' :
              'text'
            }
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            placeholder={field.label}
            value={formValues[field.label] || ''}
            onChange={handleInputChange(index)}
          />
        </div>
      ))}
    </div>
  </div>

  {/* Add/Remove Fields */}
  {isEditing && (
    <div className="flex flex-wrap items-center gap-4 mt-4">
      <button
        className="text-green-600 flex items-center gap-2"
        onClick={() =>
          setLocalData(prev => ({
            ...prev,
            formFields: [...prev.formFields, { label: 'New Field' }]
          }))
        }
      >
        <FaPlusCircle /> Add Field
      </button>
      {localData.formFields.length > 0 && (
        <button
          className="text-red-600 flex items-center gap-2"
          onClick={() =>
            setLocalData(prev => ({
              ...prev,
              formFields: prev.formFields.slice(0, -1)
            }))
          }
        >
          <FaTrash /> Remove Last Field
        </button>
      )}
    </div>
  )}

  {/* Submit Button */}
  <div className="pt-6 w-full">
    <button
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
      onClick={handleSubmit}
    >
      Submit
    </button>
  </div>
</div>

      </div>
    </section>
  );
}
