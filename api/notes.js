export default function handler(req, res) {
  const notes = [
    {
      id: 'note_1',
      title: 'Budget Planning',
      content: 'Need to review monthly expenses',
      tags: ['budget'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'note_2',
      title: 'Savings Goal',
      content: 'Save $500 for vacation',
      tags: ['savings'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    }
  ];

  if (req.method === 'GET') {
    return res.status(200).json(notes);
  }

  if (req.method === 'POST') {
    const newNote = {
      ...req.body,
      id: `note_${Date.now()}`,
      createdAt: new Date().toISOString(),
      tags: Array.isArray(req.body?.tags) ? req.body.tags : [],
    };
    return res.status(200).json(newNote);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
