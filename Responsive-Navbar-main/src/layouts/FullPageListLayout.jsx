import React from 'react';

const FullPageListLayout = ({
  content = {},
  isEditing = false,
  editData = {},
  setEditData = () => {},
}) => {
  const {
    title = 'Our Key Features',
    description = 'Explore what makes our platform powerful and user-friendly.',
    items = ['Fast performance', 'Modern UI', 'Secure and Scalable'],
  } = isEditing ? editData : content;

  const handleItemChange = (index, value) => {
    const updatedItems = [...editData.items];
    updatedItems[index] = value;
    setEditData({ ...editData, items: updatedItems });
  };

  const addItem = () => {
    setEditData({ ...editData, items: [...(editData.items || []), ''] });
  };

  const removeItem = (index) => {
    const updatedItems = [...editData.items];
    updatedItems.splice(index, 1);
    setEditData({ ...editData, items: updatedItems });
  };

  return (
    <section className="min-h-[90vh] bg-gray-100 px-6 py-16 flex flex-col items-center">
      <div className="max-w-4xl w-full text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full bg-transparent border-b border-gray-400 focus:outline-none"
              placeholder="Enter Title"
            />
          ) : (
            title
          )}
        </h2>

        <p className="text-lg text-gray-600">
          {isEditing ? (
            <textarea
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full mt-2 p-2 bg-white border border-gray-400 rounded focus:outline-none"
              placeholder="Enter Description"
              rows={3}
            />
          ) : (
            description
          )}
        </p>
      </div>

      {/* List Section */}
      <ul className="w-full max-w-3xl space-y-4">
        {(isEditing ? editData.items : items)?.map((item, index) => (
          <li
            key={index}
            className="bg-white px-6 py-4 rounded shadow text-left flex justify-between items-center"
          >
            {isEditing ? (
              <>
                <input
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:outline-none"
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 ml-4 font-bold text-lg"
                  title="Remove item"
                >
                  ×
                </button>
              </>
            ) : (
              <span>{item}</span>
            )}
          </li>
        ))}
      </ul>

      {isEditing && (
        <button
          onClick={addItem}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          + Add List Item
        </button>
      )}
    </section>
  );
};

export default FullPageListLayout;
