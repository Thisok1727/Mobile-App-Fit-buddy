/**
 * Generates a URL for a book cover from Open Library
 * @param coverId The cover ID from Open Library API
 * @param size The size of the cover image (S, M, L)
 * @returns The complete URL to the cover image
 */
export const coverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  if (!coverId) return '';
  const sizeMap = {
    'S': '-S',  // Small (thumbnail)
    'M': '-M',  // Medium (common size)
    'L': '-L'   // Large
  };
  
  return `https://covers.openlibrary.org/b/id/${coverId}${sizeMap[size]}.jpg`;
};
