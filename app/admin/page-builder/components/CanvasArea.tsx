'use client';

import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import ComponentRenderer from './ComponentRenderer';

interface CanvasAreaProps {
  components: any[];
  selectedComponent: string | null;
  onComponentSelect: (componentId: string) => void;
  onComponentUpdate: (componentId: string, updates: any) => void;
}

export default function CanvasArea({ 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onComponentUpdate 
}: CanvasAreaProps) {
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: any) => {
      // Handle component drop - this will be handled by the parent component
      console.log('Component dropped:', item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleComponentClick = useCallback((componentId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onComponentSelect(componentId);
  }, [onComponentSelect]);

  const handleCanvasClick = useCallback(() => {
    onComponentSelect('');
  }, [onComponentSelect]);

  const handleComponentDelete = useCallback((componentId: string) => {
    // Remove component from the list
    onComponentUpdate(componentId, { _delete: true });
  }, [onComponentUpdate]);

  const handleComponentDuplicate = useCallback((componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (component) {
      const duplicatedComponent = {
        ...component,
        id: `${component.id}-copy-${Date.now()}`,
        position: {
          x: component.position?.x || 0,
          y: (component.position?.y || 0) + 50
        }
      };
      onComponentUpdate('new', duplicatedComponent);
    }
  }, [components, onComponentUpdate]);

  return (
    <div className="h-full flex">
      {/* Canvas */}
      <div 
        ref={drop}
        className={`flex-1 bg-white m-4 rounded-lg shadow-sm border-2 border-dashed transition-colors ${
          isOver ? 'border-dope-orange-400 bg-dope-orange-50' : 'border-gray-200'
        }`}
        onClick={handleCanvasClick}
      >
        {/* Canvas Header */}
        <div className="border-b border-gray-200 p-4 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-600">Preview Mode</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50">
                Desktop
              </button>
              <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                Tablet
              </button>
              <button className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                Mobile
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Content */}
        <div className="p-6 min-h-96 relative">
          {components.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
                <p className="text-sm">
                  Drag components from the library or click to add them to your page
                </p>
                <div className="mt-4 text-xs text-gray-500">
                  💡 Tip: Use the Data tab to connect components to your products and brands
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {components.map((component, index) => (
                <div
                  key={component.id}
                  className={`relative group transition-all duration-200 ${
                    selectedComponent === component.id
                      ? 'ring-2 ring-dope-orange-500 ring-offset-2'
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                  onClick={(e) => handleComponentClick(component.id, e)}
                >
                  {/* Component Controls */}
                  {selectedComponent === component.id && (
                    <div className="absolute -top-10 left-0 flex items-center gap-1 bg-dope-orange-500 text-white px-2 py-1 rounded text-xs z-10">
                      <span className="font-medium">{component.name || component.type}</span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComponentDuplicate(component.id);
                          }}
                          className="hover:bg-dope-orange-600 px-1 rounded"
                          title="Duplicate"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleComponentDelete(component.id);
                          }}
                          className="hover:bg-red-600 px-1 rounded"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Component Renderer */}
                  <ComponentRenderer
                    component={component}
                    isSelected={selectedComponent === component.id}
                    onUpdate={(updates) => onComponentUpdate(component.id, updates)}
                  />

                  {/* Drag Handle */}
                  {selectedComponent === component.id && (
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-dope-orange-500 rounded cursor-move flex items-center justify-center text-white text-xs">
                      ⋮⋮
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Drop Zone Indicator */}
          {isOver && (
            <div className="absolute inset-0 bg-dope-orange-100 border-2 border-dashed border-dope-orange-400 rounded-lg flex items-center justify-center">
              <div className="text-center text-dope-orange-600">
                <div className="text-4xl mb-2">📦</div>
                <p className="font-medium">Drop component here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Minimap/Layers Panel */}
      <div className="w-64 bg-white border-l border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-3">Layers</h4>
        
        <div className="space-y-1">
          {components.map((component, index) => (
            <div
              key={component.id}
              onClick={() => onComponentSelect(component.id)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedComponent === component.id
                  ? 'bg-dope-orange-100 text-dope-orange-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-4 h-4 bg-gray-200 rounded flex-shrink-0"></div>
              <span className="text-sm truncate">
                {component.name || component.type || `Component ${index + 1}`}
              </span>
              <div className="ml-auto flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle visibility
                    onComponentUpdate(component.id, { 
                      hidden: !component.hidden 
                    });
                  }}
                  className="text-xs hover:text-gray-700"
                  title={component.hidden ? 'Show' : 'Hide'}
                >
                  {component.hidden ? '👁️‍🗨️' : '👁️'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Toggle lock
                    onComponentUpdate(component.id, { 
                      locked: !component.locked 
                    });
                  }}
                  className="text-xs hover:text-gray-700"
                  title={component.locked ? 'Unlock' : 'Lock'}
                >
                  {component.locked ? '🔒' : '🔓'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {components.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm">No components yet</p>
          </div>
        )}

        {/* Layer Controls */}
        {components.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                Group
              </button>
              <button className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">
                Align
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
