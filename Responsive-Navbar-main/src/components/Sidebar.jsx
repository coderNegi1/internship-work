// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { FaPlus, FaFileAlt, FaEdit, FaThLarge, FaCog } from 'react-icons/fa';
// import { useNavigation } from '../context/NavigationContext';

// // Import your external layouts here (replace with your actual imports)
// import { GridLayout, ListLayout, CardLayout } from '../layouts';

// // Define LayoutComponents mapping so it’s defined and usable in renderLayoutPicker
// const LayoutComponents = {
//   grid: GridLayout,
//   list: ListLayout,
//   card: CardLayout,
// };

// function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const {
//     navItems,
//     addItem,
//     updateItem,
//     deleteItem,
//     logo,
//     updateLogo,
//     setActivePageId,
//   } = useNavigation();

//   const [logoText, setLogoText] = useState(logo.text);
//   const [logoImage, setLogoImage] = useState(logo.image);
//   const [tempLogoText, setTempLogoText] = useState(logo.text);
//   const [tempLogoImage, setTempLogoImage] = useState(logo.image);
//   const [showLogoEdit, setShowLogoEdit] = useState(false);
//   const [newLink, setNewLink] = useState('');
//   const [showAddInput, setShowAddInput] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editingText, setEditingText] = useState('');

//   // Track which nav item has layout picker open
//   const [layoutPickerOpenId, setLayoutPickerOpenId] = useState(null);

//   // Track selected layouts per nav item (store component key or id)
//   const [selectedLayouts, setSelectedLayouts] = useState({});

//   const handleLogoImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = () => {
//         setTempLogoImage(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const saveLogoChanges = () => {
//     updateLogo({ text: tempLogoText, image: tempLogoImage });
//     setLogoText(tempLogoText);
//     setLogoImage(tempLogoImage);
//     setShowLogoEdit(false);
//   };

//   const cancelLogoChanges = () => {
//     setTempLogoText(logoText);
//     setTempLogoImage(logoImage);
//     setShowLogoEdit(false);
//   };

//   const handleNavClick = (item) => {
//     const path = item.slug === 'home' ? '/' : `/${item.slug}`;
//     const isOnAllPage = location.pathname === '/' || location.pathname === '/all';

//     if (isOnAllPage) {
//       setActivePageId(item.id);
//     } else {
//       navigate('/');
//       setTimeout(() => {
//         setActivePageId(item.id);
//       }, 100);
//     }
//   };

//   // Render layout picker for a nav item
//   const renderLayoutPicker = (item) => {
//     return (
//       <div
//         className="bg-gray-800 p-2 mt-1  max-h-full space-y-2"
//         style={{
//           overflowY: 'auto',
//           scrollbarWidth: 'none',    // Firefox
//           msOverflowStyle: 'none'    // IE 10+
//         }}
//       >
//         {Object.entries(LayoutComponents).map(([key, LayoutComp]) => {
//           const isSelected = selectedLayouts[item.id] === key;

//           return (
//             <button
//               key={key}
//               onClick={() => {
//                 setSelectedLayouts((prev) => ({ ...prev, [item.id]: key }));
//                 setLayoutPickerOpenId(null);
//                 console.log(`Selected layout '${key}' for page ${item.title}`);
//               }}
//               className={`w-full  border-2 ${isSelected ? 'border-cyan-500' : 'border-transparent'
//                 } focus:outline-none`}
//               title={`Select ${key} layout`}
//             >
//               <LayoutComp />
//             </button>
//           );
//         })}
//       </div>
//     );
//   };


//   return (
//     <aside className="min-w-[16rem] max-w-[30rem] bg-gray-700 p-4 min-h-screen text-text mt-13">

//       {/* LOGO EDIT SECTION */}
//       <section className="mb-6">
//         {showLogoEdit ? (
//           <>
//             <input
//               type="text"
//               value={tempLogoText}
//               onChange={(e) => setTempLogoText(e.target.value)}
//               className="w-full px-3 py-1 mb-3 text-text border border-black"
//               placeholder="Enter logo text"
//             />

//             {tempLogoImage ? (
//               <div className="flex items-center gap-3 mb-2">
//                 <img
//                   src={tempLogoImage}
//                   alt="Logo Preview"
//                   className="h-16 object-contain"
//                 />
//               </div>
//             ) : (
//               <p className="mb-2 text-text">Select LOGO</p>
//             )}
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleLogoImageChange}
//               className="mb-4 border border-black p-1"
//             />

//             <div className="flex gap-2">
//               <button
//                 onClick={saveLogoChanges}
//                 className="flex-1 bg-gray-600 text-text px-3 py-1"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={cancelLogoChanges}
//                 className="flex-1 bg-gray-400 text-text px-3 py-1"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowLogoEdit(true)}
//             className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
//           >
//             <span>Edit Logo</span>
//             <FaPlus />
//           </button>
//         )}
//       </section>

//       {/* ADD NEW PAGE SECTION */}
//       <div className="mb-6">
//         {showAddInput ? (
//           <>
//             <input
//               type="text"
//               placeholder="New link name"
//               value={newLink}
//               onChange={(e) => setNewLink(e.target.value)}
//               className="w-full px-3 py-1 border mb-2 text-text"
//             />
//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   if (newLink.trim() !== '') {
//                     addItem(newLink);
//                     setNewLink('');
//                     setShowAddInput(false);
//                   }
//                 }}
//                 className="flex-1 bg-gray-600 text-text px-3 py-1"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => {
//                   setNewLink('');
//                   setShowAddInput(false);
//                 }}
//                 className="flex-1 bg-gray-400 text-text px-3 py-1"
//               >
//                 Cancel
//               </button>
//             </div>
//           </>
//         ) : (
//           <button
//             onClick={() => setShowAddInput(true)}
//             className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
//           >
//             <span>Add New Page</span>
//             <FaPlus />
//           </button>
//         )}
//       </div>

//       {/* NAV ITEMS LIST */}
//       <ul className="space-y-2">
//         {navItems.map((item) => {
//           const path = `/${item.slug}`;
//           const isActive =
//             location.pathname === path ||
//             (item.slug === 'home' && location.pathname === '/');

//           return (
//             <li key={item.id} className="flex flex-col bg-black px-2 ">
//               {editingId === item.id ? (
//                 <div className="flex w-full">
//                   <input
//                     value={editingText}
//                     onChange={(e) => setEditingText(e.target.value)}
//                     className="w-full px-2 py-1 border text-text"
//                   />
//                   <button
//                     onClick={() => {
//                       if (editingText.trim() !== '') {
//                         updateItem(item.id, editingText);
//                         setEditingId(null);
//                         setEditingText('');
//                       }
//                     }}
//                     className="ml-2 px-2 py-1 bg-cyan-700 text-text"
//                   >
//                     Save
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleNavClick(item)}
//                       className={`flex-1 flex items-center gap-2 text-left px-4 py-2 transition ${isActive ? 'bg-gray-500 text-text' : 'hover:bg-gray-700 text-text'
//                         }`}
//                     >
//                       <FaFileAlt />
//                       {item.title}
//                     </button>

//                     <div className="flex gap-2">
//                       {/* Edit button */}
//                       <button
//                         onClick={() => {
//                           setEditingId(item.id);
//                           setEditingText(item.title);
//                         }}
//                         className="text-text"
//                         title="Edit"
//                       >
//                         <FaEdit />
//                       </button>

//                       {/* Layout button */}
//                       <button
//                         onClick={() => {
//                           setLayoutPickerOpenId(layoutPickerOpenId === item.id ? null : item.id);
//                         }}
//                         className="text-text"
//                         title="Layout"
//                       >
//                         <FaThLarge />
//                       </button>

//                       {/* Settings button */}
//                       <button
//                         onClick={() => {
//                           console.log(`Settings clicked for ${item.title}`);
//                         }}
//                         className="text-text"
//                         title="Settings"
//                       >
//                         <FaCog />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Layout picker panel */}
//                   {layoutPickerOpenId === item.id && renderLayoutPicker(item)}
//                 </>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </aside>
//   );
// }

// export default Sidebar;




import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaPlus, FaEdit, FaThLarge, FaCog } from 'react-icons/fa';
import { useNavigation } from '../context/NavigationContext';

import {   GridLayout,
  ListLayout,
  TestimonialLayout,
  HeroLayout,          
  MissionVisionLayout, 
  TeamLayout,          
  CtaLayout } from '../layouts';

const LayoutComponents = {
   grid: GridLayout,
  list: ListLayout,
  testimonial: TestimonialLayout,
 
  hero: HeroLayout,                 
  missionVision: MissionVisionLayout, 
  team: TeamLayout,                 
  cta: CtaLayout,  
};


function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    navItems,
    addItem,
    updateItem,
    logo,
    updateLogo,
    setActivePageId,
    selectedLayouts,
    setLayoutForPage
  } = useNavigation();

  const [logoText, setLogoText] = useState(logo.text);
  const [logoImage, setLogoImage] = useState(logo.image);
  const [tempLogoText, setTempLogoText] = useState(logo.text);
  const [tempLogoImage, setTempLogoImage] = useState(logo.image);
  const [showLogoEdit, setShowLogoEdit] = useState(false);
  const [newLink, setNewLink] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  const [layoutPickerOpenId, setLayoutPickerOpenId] = useState(null);

  const handleLogoImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempLogoImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveLogoChanges = () => {
    updateLogo({ text: tempLogoText, image: tempLogoImage });
    setLogoText(tempLogoText);
    setLogoImage(tempLogoImage);
    setShowLogoEdit(false);
  };

  const cancelLogoChanges = () => {
    setTempLogoText(logoText);
    setTempLogoImage(logoImage);
    setShowLogoEdit(false);
  };

  const handleNavClick = (item) => {
    const path = item.slug === 'home' ? '/' : `/${item.slug}`;
    const isOnAllPage = location.pathname === '/' || location.pathname === '/all';

    if (isOnAllPage) {
      setActivePageId(item.id);
    } else {
      navigate('/');
      setTimeout(() => {
        setActivePageId(item.id);
      }, 100);
    }
  };

  const renderLayoutPicker = (item) => {
    return (
      <div className="h-[90vh] overflow-hidden">
        <div className="bg-gray-800 p-2 mt-1 rounded space-y-2 max-h-full overflow-y-auto">
          {Object.entries(LayoutComponents).map(([key, LayoutComp]) => {
            const isSelected = selectedLayouts[item.id] === key;

            return (
              <div
                key={key}
                onClick={() => {
                  setLayoutForPage(item.id, key);
                  setLayoutPickerOpenId(null);
                }}
                className="cursor-pointer transition"
              >
                <div
                  className={`w-[400px] h-[300px] mx-auto bg-white overflow-hidden relative rounded border-2 ${isSelected ? 'border-cyan-500' : 'border-transparent'
                    } hover:border-cyan-400`}
                >
                  <div className="scale-[0.3] origin-top-left w-[1280px] h-auto pointer-events-none">
                    <React.Suspense fallback={<div className="bg-gray-700 flex items-center justify-center w-full h-full">Loading...</div>}>
                      <LayoutComp isEditing={false} />
                    </React.Suspense>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className="min-w-[16rem] max-w-[30rem] bg-gray-700 p-4 min-h-screen text-text mt-13">
      {/* LOGO EDIT SECTION */}
      <section className="mb-6">
        {showLogoEdit ? (
          <>
            <input
              type="text"
              value={tempLogoText}
              onChange={(e) => setTempLogoText(e.target.value)}
              className="w-full px-3 py-1 mb-3 text-text border border-black"
              placeholder="Enter logo text"
            />
            {tempLogoImage ? (
              <div className="flex items-center gap-3 mb-2">
                <img src={tempLogoImage} alt="Logo Preview" className="h-16 object-contain" />
              </div>
            ) : (
              <p className="mb-2 text-text">Select LOGO</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoImageChange}
              className="mb-4 border border-black p-1"
            />
            <div className="flex gap-2">
              <button onClick={saveLogoChanges} className="flex-1 bg-gray-600 text-text px-3 py-1">
                Save
              </button>
              <button onClick={cancelLogoChanges} className="flex-1 bg-gray-400 text-text px-3 py-1">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setShowLogoEdit(true)}
            className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
          >
            <span>Edit Logo</span>
            <FaPlus />
          </button>
        )}
      </section>

      {/* ADD NEW PAGE SECTION */}
      <div className="mb-6">
        {showAddInput ? (
          <>
            <input
              type="text"
              placeholder="New link name"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="w-full px-3 py-1 border mb-2 text-text"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (newLink.trim() !== '') {
                    addItem(newLink);
                    setNewLink('');
                    setShowAddInput(false);
                  }
                }}
                className="flex-1 bg-gray-600 text-text px-3 py-1"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setNewLink('');
                  setShowAddInput(false);
                }}
                className="flex-1 bg-gray-400 text-text px-3 py-1"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full bg-gray-600 text-text px-3 py-2 flex items-center justify-between"
          >
            <span>Add New Page</span>
            <FaPlus />
          </button>
        )}
      </div>

      {/* NAV ITEMS LIST */}
      <ul className="space-y-2">
        {navItems.map((item) => {
          const path = `/${item.slug}`;
          const isActive =
            location.pathname === path || (item.slug === 'home' && location.pathname === '/');

          return (
            <li key={item.id} className="flex flex-col bg-black px-2">
              {editingId === item.id ? (
                <div className="flex w-full">
                  <input
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="text-text flex-grow px-2 py-1 bg-transparent border-b border-gray-500"
                  />
                  <button
                    onClick={() => {
                      updateItem(item.id, editingText);
                      setEditingId(null);
                    }}
                    className="ml-2 text-cyan-400"
                    title="Save"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="ml-1 text-red-500"
                    title="Cancel"
                  >
                    &times;
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`flex-grow text-left py-1 px-2 ${isActive ? 'bg-cyan-800 text-cyan-400' : 'text-text hover:bg-gray-600'
                      }`}
                    title={`Go to ${item.title}`}
                  >
                    {item.title}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => {
                      setEditingId(item.id);
                      setEditingText(item.title);
                    }}
                    title="Edit title"
                    className="ml-2 text-cyan-400"
                  >
                    <FaEdit />
                  </button>

                  {/* Settings icon instead of delete */}
                  <button
                    onClick={() => {
                      console.log(`Settings for ${item.title}`);
                    }}
                    title="Page settings"
                    className="ml-2 text-gray-300 hover:text-cyan-400"
                  >
                    <FaCog />
                  </button>

                  {/* Layout picker toggle */}
                  <button
                    onClick={() =>
                      setLayoutPickerOpenId((prev) => (prev === item.id ? null : item.id))
                    }
                    title="Select layout"
                    className="ml-2 text-text hover:text-cyan-400"
                  >
                    <FaThLarge />
                  </button>
                </div>
              )}

              {/* Layout picker */}
              {layoutPickerOpenId === item.id && renderLayoutPicker(item)}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
