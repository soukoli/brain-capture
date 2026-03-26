/**
 * Example API Usage
 * This file demonstrates how to use the Brain Capture API
 */

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const USER_ID = 'demo-user'; // Replace with actual user ID from auth

// -------------------
// IDEAS API
// -------------------

/**
 * Create a new idea
 */
async function createIdea() {
  const response = await fetch(`${API_BASE_URL}/api/ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: 'Build a mobile app for tracking habits',
      user_id: USER_ID,
      priority: 'high',
      capture_method: 'quick',
      tags: ['mobile', 'productivity'],
    }),
  });

  const data = await response.json();
  console.log('Created idea:', data.data);
  return data.data;
}

/**
 * Get all ideas for a user
 */
async function getIdeas(options = {}) {
  const params = new URLSearchParams({
    user_id: USER_ID,
    limit: '20',
    offset: '0',
    ...options,
  });

  const response = await fetch(`${API_BASE_URL}/api/ideas?${params}`);
  const data = await response.json();

  console.log('Ideas:', data.data);
  console.log('Pagination:', data.pagination);
  return data.data;
}

/**
 * Get ideas filtered by status
 */
async function getInboxIdeas() {
  return getIdeas({ status: 'inbox' });
}

/**
 * Search ideas
 */
async function searchIdeas(query: string) {
  return getIdeas({ search: query });
}

/**
 * Get ideas by tag
 */
async function getIdeasByTag(tagName: string) {
  return getIdeas({ tag: tagName });
}

/**
 * Get a single idea
 */
async function getIdea(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/ideas/${id}`);
  const data = await response.json();
  return data.data;
}

/**
 * Update an idea
 */
async function updateIdea(id: string, updates: any) {
  const response = await fetch(`${API_BASE_URL}/api/ideas/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return data.data;
}

/**
 * Mark idea as processed
 */
async function processIdea(id: string, polishedContent: string) {
  return updateIdea(id, {
    status: 'processed',
    polished: polishedContent,
    ai_processed: true,
  });
}

/**
 * Delete an idea
 */
async function deleteIdea(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/ideas/${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

// -------------------
// PROJECTS API
// -------------------

/**
 * Create a new project
 */
async function createProject() {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Side Projects',
      description: 'Ideas for personal side projects',
      color: '#F59E0B',
      user_id: USER_ID,
    }),
  });

  const data = await response.json();
  return data.data;
}

/**
 * Get all projects for a user
 */
async function getProjects() {
  const params = new URLSearchParams({
    user_id: USER_ID,
    include_stats: 'true',
  });

  const response = await fetch(`${API_BASE_URL}/api/projects?${params}`);
  const data = await response.json();
  return data.data;
}

/**
 * Get a single project with stats
 */
async function getProject(id: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${id}?include_stats=true`
  );
  const data = await response.json();
  return data.data;
}

/**
 * Update a project
 */
async function updateProject(id: string, updates: any) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  const data = await response.json();
  return data.data;
}

/**
 * Archive a project
 */
async function archiveProject(id: string) {
  return updateProject(id, { status: 'archived' });
}

/**
 * Delete a project
 */
async function deleteProject(id: string) {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'DELETE',
  });

  return response.json();
}

// -------------------
// USAGE EXAMPLES
// -------------------

/**
 * Example: Quick capture flow
 */
async function quickCaptureFlow() {
  // 1. Create idea
  const idea = await createIdea();

  // 2. Process with AI (mock)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Update with polished version
  const processed = await processIdea(
    idea.id,
    'Enhanced: Build a comprehensive mobile app for tracking daily habits with AI insights'
  );

  console.log('Processed idea:', processed);
}

/**
 * Example: Project organization
 */
async function projectOrganizationFlow() {
  // 1. Create project
  const project = await createProject();

  // 2. Create ideas in project
  await fetch(`${API_BASE_URL}/api/ideas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: 'Add dark mode support',
      user_id: USER_ID,
      project_id: project.id,
      tags: ['ui', 'feature'],
    }),
  });

  // 3. Get project stats
  const stats = await getProject(project.id);
  console.log('Project stats:', stats.stats);
}

/**
 * Example: Search and filter
 */
async function searchAndFilterFlow() {
  // Search ideas
  const searchResults = await searchIdeas('mobile');

  // Get high priority ideas
  const urgent = await getIdeas({ priority: 'urgent' });

  // Get ideas by tag
  const aiIdeas = await getIdeasByTag('ai');

  console.log('Search results:', searchResults.length);
  console.log('Urgent ideas:', urgent.length);
  console.log('AI ideas:', aiIdeas.length);
}

// -------------------
// HEALTH CHECK
// -------------------

/**
 * Check API health
 */
async function healthCheck() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  const data = await response.json();
  console.log('Health:', data);
  return data.status === 'healthy';
}

// Export for use in components
export {
  // Ideas
  createIdea,
  getIdeas,
  getInboxIdeas,
  searchIdeas,
  getIdeasByTag,
  getIdea,
  updateIdea,
  processIdea,
  deleteIdea,
  // Projects
  createProject,
  getProjects,
  getProject,
  updateProject,
  archiveProject,
  deleteProject,
  // Flows
  quickCaptureFlow,
  projectOrganizationFlow,
  searchAndFilterFlow,
  // Health
  healthCheck,
};
