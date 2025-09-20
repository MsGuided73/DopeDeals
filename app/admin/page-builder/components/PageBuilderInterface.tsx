'use client';

import { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ComponentLibrary from './ComponentLibrary';
import CanvasArea from './CanvasArea';
import StyleEditor from './StyleEditor';
import DataSourcePanel from './DataSourcePanel';
import AnimationPanel from './AnimationPanel';

interface PageBuilderState {
  selectedComponent: string | null;
  components: any[];
  pageConfig: any;
  activePanel: 'components' | 'data' | 'styles' | 'animations';
}

export default function PageBuilderInterface() {
  const [builderState, setBuilderState] = useState<PageBuilderState>({
    selectedComponent: null,
    components: [],
    pageConfig: {
      title: 'New Page',
      slug: '',
      theme: 'dope-city-classic'
    },
    activePanel: 'components'
  });

  const handleComponentSelect = useCallback((componentId: string) => {
    setBuilderState(prev => ({
      ...prev,
      selectedComponent: componentId
    }));
  }, []);

  const handleComponentAdd = useCallback((component: any) => {
    const newComponent = {
      ...component,
      id: `component-${Date.now()}`,
      position: { x: 0, y: 0 },
      styles: {},
      animations: []
    };

    setBuilderState(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      selectedComponent: newComponent.id
    }));
  }, []);

  const handleComponentUpdate = useCallback((componentId: string, updates: any) => {
    setBuilderState(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === componentId ? { ...comp, ...updates } : comp
      )
    }));
  }, []);

  const handleStyleUpdate = useCallback((componentId: string, styles: any) => {
    handleComponentUpdate(componentId, { styles: { ...styles } });
  }, [handleComponentUpdate]);

  const handleAnimationUpdate = useCallback((componentId: string, animations: any[]) => {
    handleComponentUpdate(componentId, { animations });
  }, [handleComponentUpdate]);

  const renderSidePanel = () => {
    switch (builderState.activePanel) {
      case 'components':
        return <ComponentLibrary onComponentAdd={handleComponentAdd} />;
      case 'data':
        return (
          <DataSourcePanel 
            selectedComponent={builderState.selectedComponent}
            onDataSourceUpdate={(config) => {
              if (builderState.selectedComponent) {
                handleComponentUpdate(builderState.selectedComponent, { dataSource: config });
              }
            }}
          />
        );
      case 'styles':
        return (
          <StyleEditor
            selectedComponent={builderState.selectedComponent}
            components={builderState.components}
            onStyleUpdate={handleStyleUpdate}
          />
        );
      case 'animations':
        return (
          <AnimationPanel
            selectedComponent={builderState.selectedComponent}
            components={builderState.components}
            onAnimationUpdate={handleAnimationUpdate}
          />
        );
      default:
        return <ComponentLibrary onComponentAdd={handleComponentAdd} />;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        {/* Left Sidebar - Tools */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'components', label: 'Components', icon: '🧩' },
              { key: 'data', label: 'Data', icon: '🗄️' },
              { key: 'styles', label: 'Styles', icon: '🎨' },
              { key: 'animations', label: 'Animate', icon: '✨' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setBuilderState(prev => ({ ...prev, activePanel: tab.key as any }))}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors ${
                  builderState.activePanel === tab.key
                    ? 'bg-dope-orange-50 text-dope-orange-600 border-b-2 border-dope-orange-500'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {renderSidePanel()}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Page:</span>
                <input
                  type="text"
                  value={builderState.pageConfig.title}
                  onChange={(e) => setBuilderState(prev => ({
                    ...prev,
                    pageConfig: { ...prev.pageConfig, title: e.target.value }
                  }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Page title"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Slug:</span>
                <input
                  type="text"
                  value={builderState.pageConfig.slug}
                  onChange={(e) => setBuilderState(prev => ({
                    ...prev,
                    pageConfig: { ...prev.pageConfig, slug: e.target.value }
                  }))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="page-url"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50">
                Preview
              </button>
              <button className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                Save Draft
              </button>
              <button className="px-3 py-1.5 text-sm bg-dope-orange-500 text-white rounded hover:bg-dope-orange-600">
                Publish
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-gray-100 overflow-auto">
            <CanvasArea
              components={builderState.components}
              selectedComponent={builderState.selectedComponent}
              onComponentSelect={handleComponentSelect}
              onComponentUpdate={handleComponentUpdate}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties (when component selected) */}
        {builderState.selectedComponent && (
          <div className="w-80 bg-white border-l border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Component Properties</h3>
              <p className="text-sm text-gray-600">
                {builderState.components.find(c => c.id === builderState.selectedComponent)?.type || 'Unknown'}
              </p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Component-specific properties will be rendered here */}
              <div className="text-sm text-gray-500">
                Select a component to edit its properties
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
