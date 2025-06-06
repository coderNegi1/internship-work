import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaEdit, FaUpload, FaSave, FaPlus } from 'react-icons/fa';

export default function FullPageGridLayout({ content = {}, isEditing = false, onContentChange }) {
  const [localData, setLocalData] = useState({
    title: content.title || 'Carousel Theme',
    subtitle: content.subtitle || 'Subtitle goes here.',
    images: content.images || [],
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingField, setEditingField] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    setLocalData({
      title: content.title || 'Carousel Theme',
      subtitle: content.subtitle || 'Subtitle goes here.',
      images: content.images || [],
    });
  }, [content]);

  useEffect(() => {
    if (onContentChange) {
      onContentChange(localData);
    }
  }, [localData, onContentChange]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedImages = [...localData.images];
      if (editingField === 'new') {
        updatedImages.push(reader.result);
      } else {
        updatedImages[editingField] = reader.result;
      }
      setLocalData({ ...localData, images: updatedImages });
      setEditingField(null);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % localData.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + localData.images.length) % localData.images.length);
  };

  const renderImage = () => {
    const currentImage = localData.images[currentIndex];
    return (
      <div className="relative w-full h-96 bg-black">
        {currentImage ? (
          <img
            src={currentImage}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            No Image
          </div>
        )}
        {isEditing && (
          <button
            onClick={() => {
              setEditingField(currentIndex);
              fileInputRef.current.click();
            }}
            className="absolute bottom-4 right-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <FaUpload className="inline mr-2" /> Change Image
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="w-full relative p-4 bg-white shadow rounded">
      {editingField !== null && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      )}

      {/* Title */}
      <div className="text-center mb-4">
        {isEditing && editingField === 'title' ? (
          <input
            className="text-3xl font-bold text-center border-b border-green-500"
            value={localData.title}
            onChange={(e) => setLocalData({ ...localData, title: e.target.value })}
            onBlur={() => setEditingField(null)}
            autoFocus
          />
        ) : (
          <h2
            className="text-3xl font-bold cursor-pointer"
            onClick={() => isEditing && setEditingField('title')}
          >
            {localData.title}
          </h2>
        )}

        {/* Subtitle */}
        {isEditing && editingField === 'subtitle' ? (
          <textarea
            className="text-md mt-2 text-gray-600 text-center border p-2 rounded"
            value={localData.subtitle}
            onChange={(e) => setLocalData({ ...localData, subtitle: e.target.value })}
            onBlur={() => setEditingField(null)}
            autoFocus
          />
        ) : (
          <p
            className="text-md mt-2 text-gray-600 cursor-pointer"
            onClick={() => isEditing && setEditingField('subtitle')}
          >
            {localData.subtitle}
          </p>
        )}
      </div>

      {/* Carousel */}
      <div className="relative">
        {renderImage()}
        {localData.images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
              onClick={handlePrev}
            >
              <FaArrowLeft />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow"
              onClick={handleNext}
            >
              <FaArrowRight />
            </button>
          </>
        )}
      </div>

      {/* Add Image Button */}
      {isEditing && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setEditingField('new');
              fileInputRef.current.click();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FaPlus className="inline mr-2" /> Add Image
          </button>
        </div>
      )}
    </div>
  );
}