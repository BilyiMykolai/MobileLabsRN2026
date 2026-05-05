export const generateNews = (start = 0, count = 10) =>
  Array.from({ length: count }, (_, i) => ({
    id: String(start + i + 1),
    title: `Заголовок новини №${start + i + 1}`,
    description: `Короткий опис новини №${start + i + 1}. Тут міститься стислий зміст події.`,
    image: `https://picsum.photos/seed/${start + i + 1}/80/80`,
  }));