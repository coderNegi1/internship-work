// import React, { useEffect, useRef, useState } from 'react';

// const awardImages = [
//   '/award1.png',
//   '/award2.png',
//   '/award3.jpg',
//   '/award4.jpg',
//   '/award5.png',
//   '/award6.png',
//   '/award7.jpg',
//   '/award8.jpg',
// ];

// const AwardsSlider = () => {
//   const [index, setIndex] = useState(0);
//   const visibleCount = 4;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % awardImages.length);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   // Combine images to allow wrapping
//   const totalImages = [...awardImages, ...awardImages];

//   return (
//     <section className="py-10 bg-white">
//       <h2 className="text-3xl font-bold text-center mb-6">Awards & Recognitions</h2>
//       <div className="overflow-hidden w-full">
//         <div
//           className="flex transition-transform duration-700 ease-in-out"
//           style={{
//             width: `${(totalImages.length / visibleCount) * 100}%`,
//             transform: `translateX(-${(index % awardImages.length) * (100 / visibleCount)}%)`,
//           }}
//         >
//           {totalImages.map((src, i) => (
//             <div key={i} className="w-1/4 flex-shrink-0 px-4">
//               <img
//                 src={src}
//                 alt={`Award ${i + 1}`}
//                 className="w-full h-40 object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AwardsSlider;

import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave, FaPlusCircle, FaTrash } from 'react-icons/fa';

export default function AwardsSlider({ content = {}, isEditing = false, onContentChange = () => {} }) {
  const [localImages, setLocalImages] = useState(content.awardImages || [
     '/award1.png',
  '/award2.png',
  '/award3.jpg',
  '/award4.jpg',
  '/award5.png',
  '/award6.png',
  '/award7.jpg',
  '/award8.jpg',
  ]);

  const [index, setIndex] = useState(0);
  const visibleCount = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % localImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [localImages.length]);

  useEffect(() => {
    onContentChange({ awardImages: localImages });
  }, [localImages]);

  const handleImageChange = (i, value) => {
    const updated = [...localImages];
    updated[i] = value;
    setLocalImages(updated);
  };

  const totalImages = [...localImages, ...localImages];

  return (
    <section className="py-10 bg-white">
  <h2 className="text-3xl font-bold text-center mb-6">Awards & Recognitions</h2>

  {/* Award Slider */}
  <div className="overflow-hidden w-full max-w-[900px] mx-auto"> {/* limit width & center container */}
    <div
      className="flex transition-transform duration-700 ease-in-out"
      style={{
        width: `${(totalImages.length / visibleCount) * 25}%`,
        transform: `translateX(-${index * 25}%)`,
      }}
    >
      {totalImages.map((src, i) => (
        <div key={i} className="w-1/4 flex-shrink-0 px-4">
          {isEditing && i < localImages.length ? (
            <input
              value={src}
              onChange={(e) => handleImageChange(i, e.target.value)}
              className="w-full border border-gray-300 p-1 rounded mb-2"
            />
          ) : (
            <img
              src={src}
              alt={`Award ${i + 1}`}
              className="w-full h-40 object-contain"
            />
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Controls */}
  {isEditing && (
    <div className="flex items-center gap-4 justify-center mt-6">
      <button
        className="text-green-600 flex items-center gap-2"
        onClick={() => setLocalImages([...localImages, 'https://via.placeholder.com/150?text=New+Award'])}
      >
        <FaPlusCircle /> Add Award
      </button>
      {localImages.length > 0 && (
        <button
          className="text-red-600 flex items-center gap-2"
          onClick={() => setLocalImages(localImages.slice(0, -1))}
        >
          <FaTrash /> Remove Last
        </button>
      )}
    </div>
  )}
</section>

  );
}
