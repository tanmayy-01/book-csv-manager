export const generateFakeBooks = (count = 10000) => {
  const titles = [
    'The Shadow of Tomorrow', 'Echoes in Time', 'The Last Symphony', 'Whispers of the Past',
    'Dancing with Shadows', 'The Crimson Dawn', 'Silent Waters', 'Beyond the Horizon',
    'The Golden Phoenix', "Midnight's Promise', 'The Secret Garden', 'Winds of Change",
    'The Crystal Tower', 'Forgotten Dreams', 'The Silver Moon', 'Eternal Flames',
    'The Broken Crown', "Ocean's Heart', 'The Lost Kingdom', 'Starlight's Edge",
    'The Ancient Code', 'Mystic Rivers', 'The Iron Throne', 'Desert Rose',
    'The Frozen Lake', "Thunder's Call', 'The Hidden Valley', 'Blazing Sun",
    'The Dark Forest', 'Silver Arrows', 'The Enchanted Castle', 'Golden Dreams'
  ];
  
  const authors = [
    'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'David Brown', 'Lisa Davis',
    'James Wilson', 'Maria Garcia', 'Robert Taylor', 'Jennifer Martinez', 'William Anderson',
    'Jessica Thompson', 'Christopher White', 'Ashley Harris', 'Matthew Clark', 'Amanda Lewis',
    'Daniel Rodriguez', 'Stephanie Walker', 'Kevin Hall', 'Michelle Young', 'Ryan King',
    'Lauren Wright', 'Brandon Lopez', 'Samantha Hill', 'Nicholas Green', 'Rachel Adams'
  ];
  
  const genres = [
    'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller', 'Historical Fiction',
    'Literary Fiction', 'Young Adult', 'Horror', 'Adventure', 'Biography', 'Self-Help',
    'Business', 'Psychology', 'Philosophy', 'Travel', 'Cooking', 'Art', 'Music', 'Sports'
  ];
  
  const books = [];
  
  for (let i = 0; i < count; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const year = Math.floor(Math.random() * (2024 - 1950) + 1950);
    const isbn = `978-${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}-${Math.floor(Math.random() * 9)}`;
    
    books.push({
      id: i + 1,
      Title: `${title} ${i > 0 ? i + 1 : ''}`,
      Author: author,
      Genre: genre,
      PublishedYear: year.toString(),
      ISBN: isbn,
      isModified: false
    });
  }
  
  return books;
};