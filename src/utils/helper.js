export function parseAndFormatDateString(dateString) {
    const parsedDate = new Date(dateString);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
    const day = parsedDate.getDate().toString().padStart(2, "0");
  
    return `${day}-${month}-${year}`;
  }

export function capitalizeWords(text) {
  if (typeof text !== "string") return "";

  return text
    .trim()
    .split(/\s+/) // Menghilangkan spasi ganda
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}


/**
 * Mengambil URL thumbnail dari link YouTube
 * @param {string} url - URL video YouTube
 * @returns {string|null} - URL thumbnail YouTube atau null jika gagal
 */
export function youtubeThumbnailFromUrl(url) {
  if (!url || typeof url !== 'string') return null;

  // Match ID dari format ?v= dan youtu.be
  const match = url.match(/v=([^&\s]+)/) || url.match(/youtu\.be\/([^?\s]+)/);

  if (match && match[1]) {
    const videoId = match[1].trim(); // Hilangkan spasi sebelum dipakai
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return null;
}
