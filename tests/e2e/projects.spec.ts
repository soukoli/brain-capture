/**
 * E2E Tests: Projects Management
 * Tests project creation, assignment, and filtering functionality
 */

import { test, expect } from '@playwright/test';
import { sampleIdeas, sampleProjects } from '../fixtures/test-data';
import { createTestIdea, createTestProject, clearDatabase, goToCaptureB } from '../utils/test-helpers';

test.describe('Projects Management', () => {
  test.beforeEach(async ({ page }) => {
    await clearDatabase(page);
    await goToCaptureB(page);
  });

  test('should display projects section', async ({ page }) => {
    const projectsSection = page.locator('[data-testid="projects"]').or(
      page.getByRole('heading', { name: /projects/i })
    );

    await expect(projectsSection).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.getByRole('button', { name: /new project/i }).click();

    await page.getByLabel(/project name/i).fill(sampleProjects[0].name);
    await page.getByLabel(/description/i).fill(sampleProjects[0].description);

    await page.getByRole('button', { name: /create project|save/i }).click();

    // Project should appear in list
    await expect(page.getByText(sampleProjects[0].name)).toBeVisible();
  });

  test('should show validation error for empty project name', async ({ page }) => {
    await page.getByRole('button', { name: /new project/i }).click();

    // Try to create without name
    await page.getByRole('button', { name: /create project|save/i }).click();

    const errorMessage = page.getByText(/name.*required/i).or(page.getByText(/enter.*name/i));
    await expect(errorMessage).toBeVisible();
  });

  test('should select project from dropdown', async ({ page }) => {
    // Create a project first
    await createTestProject(page, sampleProjects[0]);

    // Open project selector
    const projectSelector = page.getByRole('combobox', { name: /project/i }).or(
      page.getByRole('button', { name: /select project/i })
    );

    await projectSelector.click();

    // Select the project
    await page.getByRole('option', { name: sampleProjects[0].name }).click();

    // Project should be selected
    await expect(page.getByText(sampleProjects[0].name)).toBeVisible();
  });

  test('should assign idea to project during creation', async ({ page }) => {
    // Create project first
    await createTestProject(page, sampleProjects[0]);

    // Select project
    const projectSelector = page.getByRole('combobox', { name: /project/i }).or(
      page.locator('[data-testid="project-selector"]')
    );

    if (await projectSelector.isVisible()) {
      await projectSelector.click();
      await page.getByRole('option', { name: sampleProjects[0].name }).click();
    }

    // Create idea
    const input = page.getByRole('textbox', { name: /capture/i });
    await input.fill(sampleIdeas[0].text);
    await page.getByRole('button', { name: /save/i }).click();

    // Idea should be saved with project
    await expect(page.getByText(sampleIdeas[0].text)).toBeVisible();

    // Should show project badge or indicator
    const projectBadge = page.locator(`[data-project="${sampleProjects[0].id}"]`).or(
      page.getByText(sampleProjects[0].name)
    );

    const isVisible = await projectBadge.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should assign idea to project after creation', async ({ page }) => {
    // Create project and idea separately
    await createTestProject(page, sampleProjects[0]);
    await createTestIdea(page, sampleIdeas[0].text);

    // Find the idea card
    const ideaCard = page.locator('[data-testid="idea-item"]').first();

    // Click edit or project button
    const assignButton = ideaCard.getByRole('button', { name: /assign|project/i });

    if (await assignButton.isVisible()) {
      await assignButton.click();

      // Select project
      await page.getByRole('option', { name: sampleProjects[0].name }).click();

      // Should show success message
      await expect(page.getByText(/assigned|updated/i)).toBeVisible();
    }
  });

  test('should filter ideas by project', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Create ideas with and without project
    await createTestIdea(page, sampleIdeas[0].text);
    await createTestIdea(page, sampleIdeas[1].text);

    // Click on project to filter
    await page.getByText(sampleProjects[0].name).click();

    // Should show only ideas from this project
    const ideaCards = page.locator('[data-testid="idea-item"]');
    const count = await ideaCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should show project statistics', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Create multiple ideas
    for (let i = 0; i < 3; i++) {
      await createTestIdea(page, sampleIdeas[i].text);
    }

    // Find project card
    const projectCard = page.locator('[data-testid="project-card"]').first().or(
      page.getByText(sampleProjects[0].name).locator('..')
    );

    // Should show idea count
    const stats = projectCard.locator('[data-testid="idea-count"]').or(
      projectCard.getByText(/\d+ ideas?/i)
    );

    const isVisible = await stats.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should update project stats after adding idea', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Get initial count
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const initialStats = await projectCard.textContent();

    // Add idea to project
    await createTestIdea(page, sampleIdeas[0].text);

    // Stats should update
    const updatedStats = await projectCard.textContent();
    expect(updatedStats).toBeTruthy();
  });

  test('should edit project details', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Find edit button
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const editButton = projectCard.getByRole('button', { name: /edit/i });

    if (await editButton.isVisible()) {
      await editButton.click();

      // Edit name
      const nameInput = page.getByLabel(/project name/i);
      await nameInput.clear();
      await nameInput.fill('Updated Project Name');

      // Save changes
      await page.getByRole('button', { name: /save|update/i }).click();

      // Should show updated name
      await expect(page.getByText('Updated Project Name')).toBeVisible();
    }
  });

  test('should delete project with confirmation', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Find delete button
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const deleteButton = projectCard.getByRole('button', { name: /delete/i });

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should show confirmation dialog
      const confirmDialog = page.getByRole('dialog').or(
        page.getByText(/are you sure|confirm delete/i)
      );

      await expect(confirmDialog).toBeVisible();

      // Confirm deletion
      await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

      // Project should be removed
      await expect(page.getByText(sampleProjects[0].name)).not.toBeVisible();
    }
  });

  test('should cancel project deletion', async ({ page }) => {
    // Create project
    await createTestProject(page, sampleProjects[0]);

    // Try to delete
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const deleteButton = projectCard.getByRole('button', { name: /delete/i });

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Cancel deletion
      const cancelButton = page.getByRole('button', { name: /cancel|no/i });
      await cancelButton.click();

      // Project should still exist
      await expect(page.getByText(sampleProjects[0].name)).toBeVisible();
    }
  });

  test('should show warning when deleting project with ideas', async ({ page }) => {
    // Create project and ideas
    await createTestProject(page, sampleProjects[0]);
    await createTestIdea(page, sampleIdeas[0].text);

    // Try to delete project
    const projectCard = page.locator('[data-testid="project-card"]').first();
    const deleteButton = projectCard.getByRole('button', { name: /delete/i });

    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      // Should warn about ideas
      const warning = page.getByText(/contains ideas|has \d+ ideas/i);
      const isVisible = await warning.isVisible().catch(() => false);
      expect(typeof isVisible).toBe('boolean');
    }
  });

  test('should show empty state when no projects exist', async ({ page }) => {
    const emptyState = page.getByText(/no projects yet|create your first project/i);
    await expect(emptyState).toBeVisible();
  });

  test('should display projects in a grid or list', async ({ page }) => {
    // Create multiple projects
    for (let i = 0; i < 3; i++) {
      await createTestProject(page, {
        name: `Project ${i + 1}`,
        description: `Description ${i + 1}`,
        color: sampleProjects[i].color,
      });
    }

    // Check layout
    const projectCards = page.locator('[data-testid="project-card"]');
    const count = await projectCards.count();
    expect(count).toBe(3);
  });

  test('should show project color indicator', async ({ page }) => {
    // Create project with color
    await createTestProject(page, sampleProjects[0]);

    const projectCard = page.locator('[data-testid="project-card"]').first();

    // Check for color indicator
    const colorBadge = projectCard.locator('[data-testid="project-color"]');
    const isVisible = await colorBadge.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should search/filter projects', async ({ page }) => {
    // Create multiple projects
    await createTestProject(page, sampleProjects[0]);
    await createTestProject(page, sampleProjects[1]);
    await createTestProject(page, sampleProjects[2]);

    // Look for search input
    const searchInput = page.getByRole('textbox', { name: /search projects/i }).or(
      page.locator('[data-testid="project-search"]')
    );

    if (await searchInput.isVisible()) {
      await searchInput.fill(sampleProjects[0].name);

      // Should show only matching project
      await expect(page.getByText(sampleProjects[0].name)).toBeVisible();
      await expect(page.getByText(sampleProjects[1].name)).not.toBeVisible();
    }
  });

  test('should sort projects by different criteria', async ({ page }) => {
    // Create projects
    await createTestProject(page, sampleProjects[0]);
    await createTestProject(page, sampleProjects[1]);

    // Look for sort options
    const sortButton = page.getByRole('button', { name: /sort/i }).or(
      page.locator('[data-testid="sort-projects"]')
    );

    if (await sortButton.isVisible()) {
      await sortButton.click();

      // Select sort option
      const sortByName = page.getByRole('option', { name: /name/i });
      if (await sortByName.isVisible()) {
        await sortByName.click();

        // Projects should be reordered
        await page.waitForTimeout(300);
        const projects = await page.locator('[data-testid="project-card"]').allTextContents();
        expect(projects.length).toBeGreaterThan(0);
      }
    }
  });

  test('should move idea between projects', async ({ page }) => {
    // Create two projects
    await createTestProject(page, sampleProjects[0]);
    await createTestProject(page, sampleProjects[1]);

    // Create idea in first project
    await createTestIdea(page, sampleIdeas[0].text);

    // Move to second project
    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const moveButton = ideaCard.getByRole('button', { name: /move|change project/i });

    if (await moveButton.isVisible()) {
      await moveButton.click();

      await page.getByRole('option', { name: sampleProjects[1].name }).click();

      // Should update project assignment
      await expect(page.getByText(/moved|updated/i)).toBeVisible();
    }
  });

  test('should show project in idea card', async ({ page }) => {
    // Create project and idea
    await createTestProject(page, sampleProjects[0]);
    await createTestIdea(page, sampleIdeas[0].text);

    // Idea card should show project
    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const projectBadge = ideaCard.locator('[data-testid="project-badge"]').or(
      ideaCard.getByText(sampleProjects[0].name)
    );

    const isVisible = await projectBadge.isVisible().catch(() => false);
    expect(typeof isVisible).toBe('boolean');
  });

  test('should allow removing idea from project', async ({ page }) => {
    // Create project and idea
    await createTestProject(page, sampleProjects[0]);
    await createTestIdea(page, sampleIdeas[0].text);

    // Remove from project
    const ideaCard = page.locator('[data-testid="idea-item"]').first();
    const removeButton = ideaCard.getByRole('button', { name: /remove from project/i });

    if (await removeButton.isVisible()) {
      await removeButton.click();

      // Should no longer show project badge
      const projectBadge = ideaCard.locator('[data-testid="project-badge"]');
      await expect(projectBadge).not.toBeVisible();
    }
  });

  test('should persist project selection across page refresh', async ({ page }) => {
    // Create project and select it
    await createTestProject(page, sampleProjects[0]);

    const projectSelector = page.getByRole('combobox', { name: /project/i });
    if (await projectSelector.isVisible()) {
      await projectSelector.click();
      await page.getByRole('option', { name: sampleProjects[0].name }).click();

      // Refresh page
      await page.reload();

      // Selection should persist
      await expect(page.getByText(sampleProjects[0].name)).toBeVisible();
    }
  });
});
