import * as LucideIcons from 'lucide-react';

// Pre-process icons for efficient lookup
const iconComponents = Object.fromEntries(
  Object.entries(LucideIcons)
    .filter(([_, component]) => typeof component === 'function')
);

export const getIcon = (iconName) => {
  // Direct lookup - assuming all conversions are handled
  if (iconComponents[iconName]) {
    return iconComponents[iconName];
  }

  // Fallback to a common icon if not found
  return LucideIcons.AlertCircle || LucideIcons.Smile;
};