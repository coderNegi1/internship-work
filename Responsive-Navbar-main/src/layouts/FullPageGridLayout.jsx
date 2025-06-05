import React from 'react';

const FullPageGridLayout = ({ content = {}, isEditing = false, editData = {}, setEditData = () => {} }) => {
  const { title = 'Default Title', description = 'Default Description' } = isEditing ? editData : content;

  return (
    <section className="bg-gradient-to-r from-blue-50 to-cyan-100 min-h-[90vh] p-10 flex flex-col justify-center items-center">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="text-4xl font-bold text-center bg-transparent border-b-2 border-gray-400 focus:outline-none w-full"
              placeholder="Enter Title"
            />
          ) : (
            title
          )}
        </h1>

        <p className="text-lg text-gray-600">
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full mt-2 p-2 bg-transparent border border-gray-400 rounded focus:outline-none"
              placeholder="Enter Description"
              rows={4}
            />
          ) : (
            description
          )}
        </p>
      </div>

      {/* Optional CTA button area */}
      <div className="mt-8">
        <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-full text-lg shadow-lg">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default FullPageGridLayout;
