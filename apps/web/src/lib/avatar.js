const COLORS = ['#002148', '#0A66C2', '#7A4E00', '#176B54', '#6B3FA0', '#9B3A2E'];

export function initialsAvatar(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0]?.slice(0, 2) || '?').toUpperCase();
  const hash = [...name].reduce((total, character) => total + character.charCodeAt(0), 0);
  const background = COLORS[hash % COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" fill="${background}"/><circle cx="500" cy="-20" r="180" fill="#ffc002" opacity=".16"/><circle cx="80" cy="460" r="220" fill="#fff" opacity=".08"/><text x="300" y="235" text-anchor="middle" dominant-baseline="middle" fill="white" font-family="Arial,sans-serif" font-size="150" font-weight="700">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
