import React, { useState, useEffect, useRef } from 'react';
import { FaEdit, FaUpload, FaSave } from 'react-icons/fa';

export default function SalesHeroLayout({ content = {}, isEditing, editData = {}, setEditData }) {
    const [localData, setLocalData] = useState(editData);
    const [editingField, setEditingField] = useState(null);
    const [hoveredField, setHoveredField] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (JSON.stringify(editData) !== JSON.stringify(localData)) {
            setLocalData(editData);
        }
    }, [editData, localData]);

    const handleChange = (field) => (e) => {
        const updated = { ...localData, [field]: e.target.value };
        setLocalData(updated);
        setEditData(updated);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = { ...localData, heroImg: reader.result };
            setLocalData(updated);
            setEditData(updated);
            setEditingField(null);
        };
        reader.readAsDataURL(file);
    };

    const triggerImageUpload = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const renderEditableField = (fieldKey, element, as = 'text') => {
        const isEditingThis = editingField === fieldKey;
        const isHoveringThis = hoveredField === fieldKey;

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
                        {isEditing && (
                            <button
                                onClick={() => setEditingField(fieldKey)}
                                className="absolute inset-0 opacity-0"
                                aria-label={`Edit ${fieldKey}`}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 md:mt-14 pb-10">
            <div className="max-md:mt-7 max-w-lg">
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

                {/* Example: make these also editable if needed */}
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

            {/* Optional image rendering logic can go here */}
        </main>
    );
}
