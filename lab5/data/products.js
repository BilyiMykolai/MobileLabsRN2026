export const products = Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
    title: `Товар №${i + 1}`,
    price: Math.floor(Math.random() * 5000) + 100,
    image: `https://picsum.photos/seed/${i + 10}/400/300`,
    description: `Це детальний опис товару №${i + 1}. Якісний продукт, що відповідає всім стандартам. Виготовлено з преміальних матеріалів, має гарантію 12 місяців. Підходить для щоденного використання.`,
    category: ['Електроніка', 'Одяг', 'Книги', 'Спорт'][i % 4],
    rating: (Math.random() * 2 + 3).toFixed(1),
  }));