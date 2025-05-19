import * as LucideIcons from 'lucide-react';

export const getIcon = (iconName) => {
  // First attempt: direct access with the original name
  if (typeof LucideIcons[iconName] === 'function') {
    return LucideIcons[iconName];
  }

  // Second attempt: if kebab-case, convert to PascalCase
  if (iconName.includes('-')) {
    const pascalCase = iconName
  .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

  if (typeof LucideIcons[pascalCase] === 'function') {
      return LucideIcons[pascalCase];
    }
  }
  // Third attempt: if not kebab-case, try capitalized
  else if (iconName && typeof iconName === 'string') {
    const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1);

  if (typeof LucideIcons[capitalized] === 'function') {
      return LucideIcons[capitalized];
    }
  }

  // Last resort: Go through all named exports and find one that matches
  // This is expensive but thorough
  for (const [exportName, component] of Object.entries(LucideIcons)) {
    if (typeof component === 'function') {
      // Check if export name matches our icon name in various formats
      const exportLower = exportName.toLowerCase();
  const iconLower = iconName.toLowerCase();

  // Direct match in lowercase
  if (exportLower === iconLower) {
        return component;
      }

  // Convert PascalCase to kebab for comparison
  const exportKebab = exportName
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .toLowerCase();

  if (exportKebab === iconName) {
        return component;
      }
    }
  }

  // Ultimate fallback - return an icon we know exists
  // Try several different common icons to maximize chances
  return (
  LucideIcons.AlertCircle ||
  LucideIcons.Smile ||
  LucideIcons.Check ||
  LucideIcons.Circle ||
    // If all else fails, return a function that renders nothing
    () => null
  );
};