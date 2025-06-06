import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

export default function PricingPlansLayout({ content = {}, isEditing, editData = {}, setEditData }) {
  const defaultPlans = [
    {
      name: 'Basic',
      monthlyPrice: '$19',
      yearlyPrice: '$190',
      features: ['Essential tools for getting started.'],
      buttonText: 'Choose Plan',
    },
    {
      name: 'Pro',
      monthlyPrice: '$49',
      yearlyPrice: '$490',
      features: ['Advanced features for growing teams.'],
      buttonText: 'Choose Plan',
    },
    {
      name: 'Enterprise',
      monthlyPrice: '$99',
      yearlyPrice: '$990',
      features: ['Complete solutions for enterprises.'],
      buttonText: 'Choose Plan',
    },
  ];

  const [localData, setLocalData] = useState(
    editData.plans ? editData : { plans: defaultPlans, billingCycle: 'monthly' }
  );
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    if (JSON.stringify(editData) !== JSON.stringify(localData)) {
      setLocalData(editData.plans ? editData : { plans: defaultPlans, billingCycle: 'monthly' });
    }
  }, [editData]);

  const handleChange = (planIndex, field) => (e) => {
    const updatedPlans = [...localData.plans];
    if (field === 'features') {
      updatedPlans[planIndex][field] = e.target.value.split('\n');
    } else {
      updatedPlans[planIndex][field] = e.target.value;
    }
    const updated = { ...localData, plans: updatedPlans };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleToggleBilling = () => {
    const newCycle = localData.billingCycle === 'monthly' ? 'yearly' : 'monthly';
    const updated = { ...localData, billingCycle: newCycle };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleAddPlan = () => {
    const newPlan = {
      name: 'New Plan',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      features: ['New feature'],
      buttonText: 'Choose Plan',
    };
    const updated = { ...localData, plans: [...localData.plans, newPlan] };
    setLocalData(updated);
    setEditData(updated);
  };

  const handleDeletePlan = (index) => {
    const updatedPlans = localData.plans.filter((_, i) => i !== index);
    const updated = { ...localData, plans: updatedPlans };
    setLocalData(updated);
    setEditData(updated);
  };

  const renderEditable = (planIndex, fieldKey, type = 'text') => {
    const id = `${planIndex}-${fieldKey}`;
    const isEditingThis = editingField === id;
    const value = localData.plans[planIndex][fieldKey];

    return (
      <div className="relative inline-block group w-full text-center mb-4">
        {isEditingThis ? (
          type === 'textarea' ? (
            <div>
              <textarea
                className="border p-2 rounded w-full text-black"
                value={value.join('\n')}
                rows={Math.max(3, value.length)}
                onChange={handleChange(planIndex, fieldKey)}
                autoFocus
              />
              <button onClick={() => setEditingField(null)} className="text-green-600 hover:text-green-800 mt-1">
                <FaSave />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                className="border-b bg-transparent focus:outline-none p-1 text-black w-full max-w-xs"
                value={value}
                onChange={handleChange(planIndex, fieldKey)}
                autoFocus
              />
              <button onClick={() => setEditingField(null)} className="text-green-600 hover:text-green-800">
                <FaSave />
              </button>
            </div>
          )
        ) : (
          <div className="relative cursor-pointer" onClick={() => isEditing && setEditingField(id)}>
            {type === 'textarea' ? (
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                {value.map((feat, i) => (
                  <li key={i}>• {feat}</li>
                ))}
              </ul>
            ) : (
              <span className="text-2xl font-semibold">{value}</span>
            )}
            {isEditing && (
              <FaEdit className="absolute top-0 right-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white text-center">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 xl:px-32">
        <h2 className="text-4xl font-bold mb-8">Our Pricing Plans</h2>

        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-gray-800 p-2 rounded-full flex items-center gap-4">
            <span className={localData.billingCycle === 'monthly' ? 'font-bold' : ''}>Monthly</span>
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={localData.billingCycle === 'yearly'}
                onChange={handleToggleBilling}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:left-[4px] after:top-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
            </label>
            <span className={localData.billingCycle === 'yearly' ? 'font-bold' : ''}>Yearly</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {localData.plans.map((plan, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              {isEditing && (
                <button
                  onClick={() => handleDeletePlan(index)}
                  title="Delete Plan"
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              )}

              {renderEditable(index, 'name')}
              {renderEditable(index, `${localData.billingCycle}Price`)}

              {renderEditable(index, 'features', 'textarea')}
              <button className="mt-auto bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-6 rounded-full transition duration-300">
                {plan.buttonText || 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-10">
            <button
              onClick={handleAddPlan}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Add Plan
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
