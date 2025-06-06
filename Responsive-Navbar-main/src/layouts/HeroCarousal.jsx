import React from 'react';
import { FaBolt, FaShieldAlt, FaClock, FaLeaf, FaTrash } from 'react-icons/fa';

export default function HeroCarousal({
  content = [],
  isEditing,
  editData,
  setEditData,
}) {
  const features = editData?.features || [];

  const iconOptions = {
    bolt: <FaBolt />,
    shield: <FaShieldAlt />,
    clock: <FaClock />,
    leaf: <FaLeaf />,
  };

  const handleChange = (index, field, value) => {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    setEditData({ ...editData, features: updated });
  };

  const addFeature = () => {
    setEditData({
      ...editData,
      features: [
        ...features,
        { icon: 'bolt', title: '', description: '' }
      ],
    });
  };

  const deleteFeature = (indexToRemove) => {
    const updated = features.filter((_, index) => index !== indexToRemove);
    setEditData({ ...editData, features: updated });
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">Why Choose Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg p-6 shadow text-center flex flex-col items-center relative"
            >
              {isEditing && (
                <button
                  onClick={() => deleteFeature(index)}
                  title="Delete Feature"
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              )}

              <div className="text-4xl text-blue-600 mb-4">
                {iconOptions[feature.icon] || <FaBolt />}
              </div>

              {isEditing ? (
                <div className="w-full space-y-2">
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    placeholder="Feature Title"
                    className="w-full p-2 rounded border text-black"
                  />
                  <textarea
                    value={feature.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    placeholder="Feature Description"
                    className="w-full p-2 rounded border text-black"
                  />
                  <select
                    value={feature.icon}
                    onChange={(e) => handleChange(index, 'icon', e.target.value)}
                    className="w-full p-2 border rounded text-black"
                  >
                    <option value="bolt">Bolt ⚡</option>
                    <option value="shield">Shield 🛡️</option>
                    <option value="clock">Clock 🕒</option>
                    <option value="leaf">Leaf 🌿</option>
                  </select>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 mt-2">{feature.description}</p>
                </>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-10">
            <button
              onClick={addFeature}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Add Feature
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
