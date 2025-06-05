

  import React, { useEffect, useRef, useState } from 'react';
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
