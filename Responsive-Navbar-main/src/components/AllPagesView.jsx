// import React, { useEffect, useRef } from 'react';
// import { useNavigation } from '../context/NavigationContext';

// const PageCard = React.forwardRef(({ page, isActive, updateContent, deleteItem, setActivePageId }, ref) => {
//   const [isEditing, setIsEditing] = React.useState(false);
//   const [editData, setEditData] = React.useState({
//     title: page.content.title,
//     description: page.content.description,
//   });

//   React.useEffect(() => {
//     setEditData({
//       title: page.content.title,
//       description: page.content.description,
//     });
//   }, [page.content]);

//   const handleSave = () => {
//     updateContent(page.id, editData);
//     setIsEditing(false);
//   };

//   const handleDelete = () => {
//     if (window.confirm(`Delete "${page.title}" permanently?`)) {
//       deleteItem(page.id);
//       setActivePageId((prevId) => (prevId === page.id ? null : prevId));
//     }
//   };

//   return (
//     <div
//       ref={ref}
//       className={`relative min-h-screen bg-bg-light shadow border p-8 mx-4 my-6 mt-25  `}
//     >
//       {isEditing ? (
//         <>
//           <input
//             value={editData.title}
//             onChange={(e) => setEditData({ ...editData, title: e.target.value })}
//             className="w-full mb-4 p-2 border text-3xl font-bold text-center"
//           />
//           <textarea
//             value={editData.description}
//             onChange={(e) => setEditData({ ...editData, description: e.target.value })}
//             className="w-full p-2 border h-50"
//           />
//         </>
//       ) : (
//         <>
//           <h2 className="text-3xl font-bold  text-center capitalize">{page.content.title}</h2>
//            <div className="w-30 h-1 bg-gray-400 mx-auto my-2 rounded"></div>
//           <p className="text-lg text-center m-auto max-w-2xl mt-6 mb-10">{page.content.description}</p>
//         </>
//       )}

//       {/* Position relative to outer div's bottom-left */}
//       <div className="absolute bottom-4 left-4 flex justify-center gap-4">
//         <button
//           onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//           className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white"
//         >
//           {isEditing ? 'Save' : 'Edit content'}
//         </button>
//         <button onClick={handleDelete} className="px-4 py-2 bg-white border hover:shadow-lg text-black">
//           Delete Page
//         </button>
//         {isEditing && (
//           <button
//             onClick={() => setIsEditing(false)}
//             className="px-4 py-2 bg-gray-400 text-white"
//           >
//             Cancel
//           </button>
//         )}
//       </div>
//     </div>

//   );
// });

// export default function AllPagesView() {
//   const { navItems, activePageId, updateContent, deleteItem, setActivePageId } = useNavigation();
//   const containerRef = useRef(null);
//   const pageRefs = useRef({});

//     useEffect(() => {
//       if (!activePageId || !containerRef.current) return;

//       const pageEl = pageRefs.current[activePageId];
//       if (pageEl) {
//         pageEl.scrollIntoView({ behavior: 'smooth' });
//       }
//     }, [activePageId]);

//   return (
//     <div
//       ref={containerRef}
//       className="overflow-y-auto h-full  py-6"
//       style={{ scrollBehavior: 'smooth' }}
//     >
//       {navItems.map((page) => (
//         <PageCard
//           key={page.id}
//           page={page}
//           isActive={activePageId === page.id}
//           ref={(el) => (pageRefs.current[page.id] = el)}
//           updateContent={updateContent}
//           deleteItem={deleteItem}
//           setActivePageId={setActivePageId}
//         />
//       ))}
//     </div>
//   );
// }











  import React, { useEffect, useRef, useState } from 'react';
  import { useNavigation } from '../context/NavigationContext';
  import { GridLayout, ListLayout, NewHeroLayout } from '../layouts';

  const LayoutComponents = {
    grid: GridLayout,
    list: ListLayout,
    newHero: NewHeroLayout,
  };

  const PageCard = React.forwardRef(
    ({ page, layoutKey, updateContent, deleteItem, setActivePageId }, ref) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editData, setEditData] = useState({
        title: page.content.title,
        description: page.content.description,
      });

      useEffect(() => {
        setEditData({
          title: page.content.title,
          description: page.content.description,
        });
      }, [page.content]);

      const handleSave = () => {
        updateContent(page.id, editData);
        setIsEditing(false);
      };

      const handleDelete = () => {
        if (window.confirm(`Delete "${page.title}" permanently?`)) {
          deleteItem(page.id);
          setActivePageId((prevId) => (prevId === page.id ? null : prevId));
        }
      };

      const LayoutComponent = LayoutComponents[layoutKey] || GridLayout;

      return (
        <div
          ref={ref}
          className="relative min-h-screen bg-bg-light shadow border p-8 mx-4 my-6 mt-25"
          id={`page-${page.id}`}
        >
          {/* Remove title/description outside layout */}

          {/* Layout preview ONLY */}
          <div className="my-6">
            <LayoutComponent
              content={page.content}
              isEditing={isEditing}
              editData={editData}
              setEditData={setEditData}
            />
          </div>

          {/* Edit/Delete Controls */}
          <div className="absolute bottom-4 left-4 flex justify-center gap-4">
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white"
            >
              {isEditing ? 'Save' : 'Edit content'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-white border hover:shadow-lg text-black"
            >
              Delete Page
            </button>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-400 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      );
    }
  );


  export default function AllPagesView() {
    const {
      navItems,
      activePageId,
      updateContent,
      deleteItem,
      setActivePageId,
      selectedLayouts,
    } = useNavigation();

    const containerRef = useRef(null);
    const pageRefs = useRef({});

    useEffect(() => {
      if (!activePageId || !containerRef.current) return;

      const pageEl = pageRefs.current[activePageId];
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, [activePageId]);

    return (
      <div
        ref={containerRef}
        className="overflow-y-auto h-full py-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {navItems.length === 0 ? (
          <p className="text-center text-gray-500">No pages found. Add one from sidebar.</p>
        ) : (
          navItems.map((page) => (
            <PageCard
              key={page.id}
              page={page}
              ref={(el) => (pageRefs.current[page.id] = el)}
              layoutKey={selectedLayouts[page.id]}
              updateContent={updateContent}
              deleteItem={deleteItem}
              setActivePageId={setActivePageId}
            />
          ))
        )}
      </div>
    );
  }
