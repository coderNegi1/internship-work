import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave, FaTrashAlt } from 'react-icons/fa'; // Added FaTrashAlt for delete

export default function SalesHeroLayout({ content = {}, isEditing, editData = {}, setEditData }) {
    const [localData, setLocalData] = useState(editData);
    const [editingField, setEditingField] = useState(null);
    const [hoveredField, setHoveredField] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Only update localData if editData has truly changed, to prevent infinite loops
        if (JSON.stringify(editData) !== JSON.stringify(localData)) {
            setLocalData(editData);
        }
    }, [editData, localData]);

    const handleChange = (field) => (e) => {
        const updated = { ...localData, [field]: e.target.value };
        setLocalData(updated);
        setEditData(updated); // Propagate changes up to the parent
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = { ...localData, heroImg: reader.result, bgColor: null }; // Clear bgColor if image is set
            setLocalData(updated);
            setEditData(updated);
            setEditingField(null); // Exit editing mode after upload
        };
        reader.readAsDataURL(file);
    };

    const handleImageDelete = () => {
        const updated = { ...localData, heroImg: null }; // Remove image
        setLocalData(updated);
        setEditData(updated);
        setEditingField(null);
    };

    const handleBgColorChange = (e) => {
        const updated = { ...localData, bgColor: e.target.value, heroImg: null }; // Clear heroImg if color is set
        setLocalData(updated);
        setEditData(updated);
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const renderEditableField = (fieldKey, element, as = 'text') => {
        const isEditingThis = editingField === fieldKey;

        return (
            <div
                className="relative inline-block"
                onMouseEnter={() => isEditing && setHoveredField(fieldKey)}
                onMouseLeave={() => setHoveredField(null)}
            >
                {isEditingThis ? (
                    <div className="flex items-center gap-2">
                        {as === 'text' && (
                            <input
                                type="text"
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border-b border-blue-500 bg-transparent focus:outline-none"
                                autoFocus
                            />
                        )}
                        {as === 'textarea' && (
                            <textarea
                                value={localData[fieldKey] ?? ''}
                                onChange={handleChange(fieldKey)}
                                className="border p-2 rounded resize-y focus:outline-blue-500"
                                rows={3}
                                autoFocus
                            />
                        )}
                        <button onClick={() => setEditingField(null)} className="text-primary">
                            <FaSave />
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        {element}
                        {isEditing && hoveredField === fieldKey && ( // Show edit icon only when editing and hovered
                            <button
                                onClick={() => setEditingField(fieldKey)}
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-white rounded-full p-1 shadow-md text-blue-500 hover:text-blue-700"
                                aria-label={`Edit ${fieldKey}`}
                            >
                                <FaEdit size={14} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const heroStyle = {
        backgroundImage: localData.heroImg ? `url(${localData.heroImg})` : 'none',
        backgroundColor: localData.bgColor || 'transparent', // Fallback to transparent if no color
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    return (
        <main
            className="relative flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 md:mt-14 pb-10 min-h-[500px]" // Added min-h for visibility
            style={heroStyle}
        >
            {isEditing && (
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    {localData.heroImg ? (
                        <>
                            <button
                                onClick={handleImageDelete}
                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md"
                                title="Delete Image"
                            >
                                <FaTrashAlt />
                            </button>
                            <button
                                onClick={triggerImageUpload}
                                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
                                title="Change Image"
                            >
                                <FaUpload />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={triggerImageUpload}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md"
                            title="Upload Image"
                        >
                            <FaUpload />
                        </button>
                    )}
                    {!localData.heroImg && ( // Only show color picker if no image
                        <div className="relative">
                            <input
                                type="color"
                                value={localData.bgColor || '#ffffff'} // Default to white if no color set
                                onChange={handleBgColorChange}
                                className="p-1 border-none rounded-full cursor-pointer h-10 w-10"
                                title="Choose Background Color"
                            />
                             <span className="absolute inset-0 border-2 border-transparent hover:border-blue-500 rounded-full pointer-events-none"></span> {/* Visual cue for hover */}
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
            )}

            <div className="max-md:mt-7 max-w-lg relative z-0"> {/* Ensure content is above image */}
                <h1 className="text-5xl md:text-[74px] text-blue-500 max-w-96 leading-tight">
                    {renderEditableField(
                        'headlineStart',
                        <span>{localData.headlineStart ?? content.headlineStart ?? 'Drive sales to'}</span>
                    )}{' '}
                    {renderEditableField(
                        'headlineEnd',
                        <span className="underline font-bold">{localData.headlineEnd ?? content.headlineEnd ?? 'the sky'}</span>
                    )}
                </h1>

                <div className="mt-8 text-gray-500 text-sm sm:text-base max-w-lg">
                    {renderEditableField(
                        'description',
                        <p>{localData.description ?? content.description ?? 'Unlock potential with tailored strategies...'}</p>,
                        'textarea'
                    )}
                </div>

                <div className="flex items-center mt-6 gap-4">
                    {renderEditableField(
                        'primaryCta',
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-md transition">
                            {localData.primaryCta ?? content.primaryCta ?? 'Stream Now'}
                        </button>
                    )}
                    {renderEditableField(
                        'secondaryCta',
                        <button className="flex items-center gap-1.5 px-6 py-2.5 text-blue-500 underline">
                            {localData.secondaryCta ?? content.secondaryCta ?? 'Watch how it works'}
                            <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 5.5h13.09M8.948 1l5.143 4.5L8.948 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="flex items-center max-md:justify-center text-gray-600 text-xs md:text-sm mt-8">
                    <div className="flex items-center gap-2 py-3 pr-6 border-r border-gray-300">
                        <svg className="w-6 h-6" fill="#1AB553" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                        <p>Complete Access</p>
                    </div>
                    <div className="flex items-center gap-2 py-3 px-6">
                        <svg className="w-6 h-6" fill="#FC9D50" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" /></svg>
                        <p>100% Uptime</p>
                    </div>
                </div>
            </div>
        </main>
    );
}