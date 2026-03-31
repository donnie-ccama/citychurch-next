'use client';

import { useState, useEffect, useRef } from 'react';
import { BlogPost } from '@/lib/types';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: 'Outreach' | 'Documentary' | 'Leadership' | 'Community';
    author: string;
    content: string;
    excerpt: string;
    reading_time: string;
    published: boolean;
    featured_image: string;
  }>({
    title: '',
    slug: '',
    category: 'Outreach',
    author: '',
    content: '',
    excerpt: '',
    reading_time: '',
    published: false,
    featured_image: '',
  });

  const [featuredUploading, setFeaturedUploading] = useState(false);
  const [inlineUploading, setInlineUploading] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const inlineInputRef = useRef<HTMLInputElement>(null);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'Outreach',
      author: '',
      content: '',
      excerpt: '',
      reading_time: '',
      published: false,
      featured_image: '',
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category,
      author: post.author,
      content: post.content,
      excerpt: post.excerpt,
      reading_time: String(post.reading_time),
      published: post.published,
      featured_image: post.featured_image || '',
    });
    setShowForm(true);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const body = new FormData();
    body.append('file', file);

    const res = await fetch('/api/admin/upload', { method: 'POST', body });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Upload failed');
      return null;
    }
    const data = await res.json();
    return data.url;
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFeaturedUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, featured_image: url }));
    }
    setFeaturedUploading(false);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploading(true);
    const url = await uploadImage(file);
    if (url) {
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const markdown = `![${file.name}](${url})`;
        const newContent = text.substring(0, start) + markdown + text.substring(end);
        setFormData((prev) => ({ ...prev, content: newContent }));

        // Restore cursor position after the inserted markdown
        requestAnimationFrame(() => {
          textarea.focus();
          const newPos = start + markdown.length;
          textarea.setSelectionRange(newPos, newPos);
        });
      }
    }
    setInlineUploading(false);
    e.target.value = '';
  };

  const handleFeaturedDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    setFeaturedUploading(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, featured_image: url }));
    }
    setFeaturedUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      slug: formData.slug,
      content: formData.content,
      excerpt: formData.excerpt,
      category: formData.category,
      author: formData.author,
      featured_image: formData.featured_image || null,
      published: formData.published,
      reading_time: parseInt(formData.reading_time) || 0,
    };

    if (editingPost) {
      // Update existing post
      const res = await fetch('/api/admin/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingPost.id, ...payload }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
        resetForm();
      }
    } else {
      // Create new post
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setPosts([created, ...posts]);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/blog', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setPosts(posts.filter((post) => post.id !== id));
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '1rem',
    boxSizing: 'border-box' as const,
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading blog posts...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Blog Posts</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                readOnly
                style={{
                  ...inputStyle,
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as 'Outreach' | 'Documentary' | 'Leadership' | 'Community',
                    })
                  }
                  style={inputStyle}
                >
                  <option>Outreach</option>
                  <option>Documentary</option>
                  <option>Leadership</option>
                  <option>Community</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Author *
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Featured Image Upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Featured Image
              </label>
              <input
                ref={featuredInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFeaturedImageUpload}
                style={{ display: 'none' }}
              />
              {formData.featured_image ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.featured_image}
                    alt="Featured preview"
                    style={{
                      width: '100%',
                      maxHeight: '240px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => featuredInputRef.current?.click()}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      Replace Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured_image: '' })}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#EF4444',
                        border: '1px solid #EF4444',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !featuredUploading && featuredInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFeaturedDrop}
                  style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: featuredUploading ? 'wait' : 'pointer',
                    transition: 'border-color 0.2s ease',
                    backgroundColor: 'var(--bg-primary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!featuredUploading) e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {featuredUploading ? (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>...</div>
                      Uploading...
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>+</div>
                      Click or drag an image here
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        JPEG, PNG, WebP, or GIF (max 5MB)
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                }}
              />
            </div>

            {/* Content with Insert Image button */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: '500' }}>
                  Content (Markdown)
                </label>
                <div>
                  <input
                    ref={inlineInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleInlineImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => !inlineUploading && inlineInputRef.current?.click()}
                    disabled={inlineUploading}
                    style={{
                      padding: '0.4rem 0.75rem',
                      backgroundColor: 'transparent',
                      color: inlineUploading ? 'var(--text-secondary)' : 'var(--accent)',
                      border: `1px solid ${inlineUploading ? 'var(--border-color)' : 'var(--accent)'}`,
                      borderRadius: '6px',
                      cursor: inlineUploading ? 'wait' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!inlineUploading) {
                        e.currentTarget.style.backgroundColor = 'var(--accent)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = inlineUploading ? 'var(--text-secondary)' : 'var(--accent)';
                    }}
                  >
                    {inlineUploading ? 'Uploading...' : 'Insert Image'}
                  </button>
                </div>
              </div>
              <textarea
                ref={contentRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                style={{
                  ...inputStyle,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  minHeight: '200px',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  value={formData.reading_time}
                  onChange={(e) => setFormData({ ...formData, reading_time: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  Publish immediately
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {editingPost ? 'Update Post' : 'Save Post'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Title
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post.id}
                style={{
                  borderBottom: index !== posts.length - 1 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <td style={{ padding: '1rem', fontWeight: '500' }}>{post.title}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{post.category}</td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: post.published ? 'rgba(34, 197, 94, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                      color: post.published ? '#22C55E' : '#6B7280',
                    }}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td
                  style={{
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                  }}
                >
                  <button
                    onClick={() => handleEdit(post)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      color: '#EF4444',
                      border: '1px solid #EF4444',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#EF4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-secondary)',
          }}
        >
          <p>No blog posts yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
