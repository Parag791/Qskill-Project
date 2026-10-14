const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3002;
const DATA = path.join(__dirname, 'data', 'posts.json');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readPosts() {
  try { return JSON.parse(fs.readFileSync(DATA, 'utf8')); }
  catch { return []; }
}
function savePosts(posts) { fs.writeFileSync(DATA, JSON.stringify(posts, null, 2)); }

app.get('/api/posts', (req, res) => res.json(readPosts()));
app.post('/api/posts', (req, res) => {
  const title = String(req.body.title || '').trim();
  const content = String(req.body.content || '').trim();
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  const posts = readPosts();
  const post = { id: Date.now().toString(), title, content, updatedAt: new Date().toISOString() };
  posts.unshift(post); savePosts(posts); res.status(201).json(post);
});
app.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  const title = String(req.body.title || '').trim();
  const content = String(req.body.content || '').trim();
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  post.title = title; post.content = content; post.updatedAt = new Date().toISOString();
  savePosts(posts); res.json(post);
});
app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const next = posts.filter(p => p.id !== req.params.id);
  if (next.length === posts.length) return res.status(404).json({ error: 'Post not found.' });
  savePosts(next); res.json({ success: true });
});
app.listen(PORT, () => console.log(`Blog app running at http://localhost:${PORT}`));
