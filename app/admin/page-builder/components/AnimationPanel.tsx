'use client';

import { useState, useEffect } from 'react';

interface AnimationPanelProps {
  selectedComponent: string | null;
  components: any[];
  onAnimationUpdate: (componentId: string, animations: any[]) => void;
}

interface Animation {
  id: string;
  name: string;
  trigger: 'onLoad' | 'onScroll' | 'onHover' | 'onClick' | 'onVisible';
  type: 'fadeIn' | 'slideIn' | 'scaleIn' | 'rotateIn' | 'bounceIn' | 'custom';
  duration: number;
  delay: number;
  easing: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  scale?: { from: number; to: number };
  rotation?: { from: number; to: number };
  opacity?: { from: number; to: number };
  isActive: boolean;
}

const animationPresets = [
  {
    name: 'Fade In',
    type: 'fadeIn',
    icon: '🌅',
    description: 'Smooth opacity transition',
    defaultConfig: {
      duration: 600,
      delay: 0,
      easing: 'ease-out',
      opacity: { from: 0, to: 1 }
    }
  },
  {
    name: 'Slide In Up',
    type: 'slideIn',
    icon: '⬆️',
    description: 'Slide from bottom',
    defaultConfig: {
      duration: 500,
      delay: 0,
      easing: 'ease-out',
      direction: 'up',
      distance: 50
    }
  },
  {
    name: 'Slide In Left',
    type: 'slideIn',
    icon: '⬅️',
    description: 'Slide from right',
    defaultConfig: {
      duration: 500,
      delay: 0,
      easing: 'ease-out',
      direction: 'left',
      distance: 50
    }
  },
  {
    name: 'Scale In',
    type: 'scaleIn',
    icon: '🔍',
    description: 'Scale from small to normal',
    defaultConfig: {
      duration: 400,
      delay: 0,
      easing: 'ease-out',
      scale: { from: 0.8, to: 1 }
    }
  },
  {
    name: 'Bounce In',
    type: 'bounceIn',
    icon: '🏀',
    description: 'Bouncy entrance effect',
    defaultConfig: {
      duration: 800,
      delay: 0,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      scale: { from: 0.3, to: 1 }
    }
  },
  {
    name: 'Rotate In',
    type: 'rotateIn',
    icon: '🌀',
    description: 'Rotate while fading in',
    defaultConfig: {
      duration: 600,
      delay: 0,
      easing: 'ease-out',
      rotation: { from: -180, to: 0 },
      opacity: { from: 0, to: 1 }
    }
  }
];

const easingOptions = [
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
  { value: 'linear', label: 'Linear' },
  { value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', label: 'Bounce' },
  { value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', label: 'Smooth' }
];

export default function AnimationPanel({ selectedComponent, components, onAnimationUpdate }: AnimationPanelProps) {
  const [animations, setAnimations] = useState<Animation[]>([]);
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);

  const selectedComponentData = components.find(c => c.id === selectedComponent);

  useEffect(() => {
    if (selectedComponentData?.animations) {
      setAnimations(selectedComponentData.animations);
    } else {
      setAnimations([]);
    }
  }, [selectedComponent, selectedComponentData]);

  const addAnimation = (preset: any) => {
    const newAnimation: Animation = {
      id: `anim-${Date.now()}`,
      name: preset.name,
      trigger: 'onLoad',
      type: preset.type,
      ...preset.defaultConfig,
      isActive: true
    };

    const updatedAnimations = [...animations, newAnimation];
    setAnimations(updatedAnimations);
    setSelectedAnimation(newAnimation.id);
    
    if (selectedComponent) {
      onAnimationUpdate(selectedComponent, updatedAnimations);
    }
  };

  const updateAnimation = (animationId: string, updates: Partial<Animation>) => {
    const updatedAnimations = animations.map(anim => 
      anim.id === animationId ? { ...anim, ...updates } : anim
    );
    setAnimations(updatedAnimations);
    
    if (selectedComponent) {
      onAnimationUpdate(selectedComponent, updatedAnimations);
    }
  };

  const removeAnimation = (animationId: string) => {
    const updatedAnimations = animations.filter(anim => anim.id !== animationId);
    setAnimations(updatedAnimations);
    setSelectedAnimation(null);
    
    if (selectedComponent) {
      onAnimationUpdate(selectedComponent, updatedAnimations);
    }
  };

  const duplicateAnimation = (animationId: string) => {
    const animation = animations.find(anim => anim.id === animationId);
    if (animation) {
      const duplicated = {
        ...animation,
        id: `anim-${Date.now()}`,
        name: `${animation.name} Copy`
      };
      const updatedAnimations = [...animations, duplicated];
      setAnimations(updatedAnimations);
      
      if (selectedComponent) {
        onAnimationUpdate(selectedComponent, updatedAnimations);
      }
    }
  };

  const previewAnimation = (animationId: string) => {
    // This would trigger a preview of the animation
    console.log('Preview animation:', animationId);
  };

  if (!selectedComponent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="mb-4">✨</div>
        <p className="text-sm">Select a component to add animations</p>
      </div>
    );
  }

  const selectedAnimationData = animations.find(anim => anim.id === selectedAnimation);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Animations</h3>
        
        {/* Animation Presets */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add Animation</h4>
          <div className="grid grid-cols-2 gap-2">
            {animationPresets.map(preset => (
              <button
                key={preset.type}
                onClick={() => addAnimation(preset)}
                className="p-3 text-left border border-gray-200 rounded-lg hover:border-dope-orange-300 hover:bg-dope-orange-50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{preset.icon}</span>
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs text-gray-600">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Animation List */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Current Animations</h4>
          {animations.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <div className="text-2xl mb-2">🎭</div>
              <p className="text-sm">No animations added yet</p>
            </div>
          ) : (
            animations.map(animation => (
              <div
                key={animation.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAnimation === animation.id
                    ? 'border-dope-orange-500 bg-dope-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAnimation(animation.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${animation.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="font-medium text-sm">{animation.name}</span>
                    <span className="text-xs text-gray-500">on {animation.trigger}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewAnimation(animation.id);
                      }}
                      className="text-xs hover:text-dope-orange-600"
                      title="Preview"
                    >
                      ▶️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateAnimation(animation.id);
                      }}
                      className="text-xs hover:text-blue-600"
                      title="Duplicate"
                    >
                      📋
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAnimation(animation.id);
                      }}
                      className="text-xs hover:text-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Animation Editor */}
      {selectedAnimationData && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Edit Animation</h4>
          
          <div className="space-y-4">
            {/* Animation Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={selectedAnimationData.name}
                onChange={(e) => updateAnimation(selectedAnimationData.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            {/* Trigger */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
              <select
                value={selectedAnimationData.trigger}
                onChange={(e) => updateAnimation(selectedAnimationData.id, { trigger: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="onLoad">On Load</option>
                <option value="onScroll">On Scroll</option>
                <option value="onVisible">When Visible</option>
                <option value="onHover">On Hover</option>
                <option value="onClick">On Click</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration ({selectedAnimationData.duration}ms)
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={selectedAnimationData.duration}
                onChange={(e) => updateAnimation(selectedAnimationData.id, { duration: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delay ({selectedAnimationData.delay}ms)
              </label>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={selectedAnimationData.delay}
                onChange={(e) => updateAnimation(selectedAnimationData.id, { delay: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* Easing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Easing</label>
              <select
                value={selectedAnimationData.easing}
                onChange={(e) => updateAnimation(selectedAnimationData.id, { easing: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {easingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Type-specific controls */}
            {selectedAnimationData.type === 'slideIn' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                  <select
                    value={selectedAnimationData.direction || 'up'}
                    onChange={(e) => updateAnimation(selectedAnimationData.id, { direction: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance ({selectedAnimationData.distance || 50}px)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={selectedAnimationData.distance || 50}
                    onChange={(e) => updateAnimation(selectedAnimationData.id, { distance: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {selectedAnimationData.type === 'scaleIn' && selectedAnimationData.scale && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale From ({selectedAnimationData.scale.from})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={selectedAnimationData.scale.from}
                    onChange={(e) => updateAnimation(selectedAnimationData.id, { 
                      scale: { ...selectedAnimationData.scale!, from: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scale To ({selectedAnimationData.scale.to})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={selectedAnimationData.scale.to}
                    onChange={(e) => updateAnimation(selectedAnimationData.id, { 
                      scale: { ...selectedAnimationData.scale!, to: parseFloat(e.target.value) }
                    })}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Active Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Active</span>
              <button
                onClick={() => updateAnimation(selectedAnimationData.id, { isActive: !selectedAnimationData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  selectedAnimationData.isActive ? 'bg-dope-orange-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    selectedAnimationData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Preview Button */}
            <button
              onClick={() => previewAnimation(selectedAnimationData.id)}
              className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Preview Animation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
