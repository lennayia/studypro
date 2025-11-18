/**
 * Icon - Univerzální komponenta pro ikony
 *
 * Používá Lucide React ikony s centralizovaným theme
 *
 * @example
 * // Základní použití
 * <Icon name="BookOpen" size={20} color="#6366f1" />
 *
 * // Se sémantickým stylem
 * <Icon name="Trophy" semantic="pageTitle" />
 *
 * // S custom props
 * <Icon name="Flame" semantic="streak" strokeWidth={2} />
 */

import * as LucideIcons from 'lucide-react';
import { getIconStyle, ICON_COLORS, ICON_SIZES } from '../../constants/iconTheme';

export const Icon = ({
  name,
  size,
  color,
  semantic,
  ...props
}) => {
  // Získej komponentu z Lucide
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  // Pokud je semantic, použij předdefinovaný styl
  let finalSize = size;
  let finalColor = color;

  if (semantic) {
    const style = getIconStyle(semantic);
    finalSize = finalSize || style.size;
    finalColor = finalColor || style.color;
  }

  return (
    <IconComponent
      size={finalSize || ICON_SIZES.base}
      color={finalColor}
      {...props}
    />
  );
};

// Export ICON_COLORS a ICON_SIZES pro přímý přístup
export { ICON_COLORS, ICON_SIZES };
