import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { lessonId, lessonTitle, selectedText, suggestion, context } = request.body;

    if (!suggestion || !lessonId) {
        return response.status(400).json({ error: 'Missing required fields' });
    }

    const token = process.env.GITHUB_ACCESS_TOKEN;
    const owner = process.env.GITHUB_REPO_OWNER || 'finchfry94';
    const repo = process.env.GITHUB_REPO_NAME || 'crab-cademy';

    if (!token) {
        console.error('GITHUB_ACCESS_TOKEN is not defined');
        return response.status(500).json({ error: 'Server configuration error' });
    }

    const title = `[Feedback] ${lessonTitle || lessonId}`;
    const body = `
### Lesson
**ID:** \`${lessonId}\`
**Title:** ${lessonTitle || 'N/A'}
**Context:** ${context || 'N/A'}

### Selected Text
> ${selectedText ? selectedText.replace(/\n/g, '\n> ') : '(No specific text selected)'}

### Suggestion
${suggestion}
  `.trim();

    try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, body }),
        });

        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`GitHub API error: ${res.status} - ${errorData}`);
        }

        const issue = await res.json();
        return response.status(200).json({ url: issue.html_url });
    } catch (error) {
        console.error('Error creating issue:', error);
        return response.status(500).json({ error: 'Failed to create issue on GitHub' });
    }
}
