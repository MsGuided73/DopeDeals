import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FeedbackData {
  type: 'bug' | 'design' | 'feature' | 'other';
  description: string;
  pageUrl: string;
  browser: string;
  contactInfo?: string;
  timestamp: string;
}

const GLITCHES_FILE_PATH = path.join(process.cwd(), 'POST_DEPLOYMENT_GLITCHES.md');

export async function POST(request: NextRequest) {
  try {
    const feedback: FeedbackData = await request.json();

    // Validate required fields
    if (!feedback.description || !feedback.type || !feedback.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the feedback entry
    const issueNumber = await getNextIssueNumber();
    const formattedEntry = formatFeedbackEntry(feedback, issueNumber);

    // Append to the glitches file
    await appendToGlitchesFile(formattedEntry);

    return NextResponse.json(
      { message: 'Feedback submitted successfully', issueNumber },
      { status: 200 }
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

async function getNextIssueNumber(): Promise<number> {
  try {
    const content = fs.readFileSync(GLITCHES_FILE_PATH, 'utf-8');
    const issueMatches = content.match(/Issue #(\d+):/g);
    if (issueMatches) {
      const numbers = issueMatches.map(match => parseInt(match.match(/#(\d+)/)?.[1] || '0'));
      return Math.max(...numbers) + 1;
    }
    return 2; // Start from 2 since Issue #1 already exists
  } catch (error) {
    console.error('Error reading glitches file:', error);
    return 2;
  }
}

function formatFeedbackEntry(feedback: FeedbackData, issueNumber: number): string {
  const date = new Date(feedback.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const typeLabels = {
    bug: '🐛 Bug Report',
    design: '🎨 Design Issue',
    feature: '✨ Feature Request',
    other: '💭 Other Feedback'
  };

  const severityMap = {
    bug: 'Medium',
    design: 'Low',
    feature: 'Low',
    other: 'Low'
  };

  let entry = `

## Issue #${issueNumber}: ${typeLabels[feedback.type]}

**Date Reported:** ${date}
**Component:** User Feedback
**Affected Element:** ${feedback.pageUrl}
**Browser/Device:** ${feedback.browser}
**Severity:** ${severityMap[feedback.type]}
**Status:** Open

### Description
${feedback.description}

### Steps to Reproduce
1. User reported via feedback form
2. Issue occurs on: ${feedback.pageUrl}

### Technical Details
**User Agent:** ${feedback.browser}
**Page URL:** ${feedback.pageUrl}
**Feedback Type:** ${typeLabels[feedback.type]}

### Proposed Solutions
[To be determined by development team]

### Priority
- Medium: User-reported issue requiring attention
- ${severityMap[feedback.type]}: ${typeLabels[feedback.type].toLowerCase()}

### Assigned To
[Unassigned]

### Notes
${feedback.contactInfo ? `**Contact Info:** ${feedback.contactInfo}` : 'No contact information provided'}
- Submitted via user feedback form
- Requires investigation and validation

---

`;

  return entry;
}

async function appendToGlitchesFile(entry: string): Promise<void> {
  try {
    // Read the current file
    let content = fs.readFileSync(GLITCHES_FILE_PATH, 'utf-8');

    // Find the template section and insert the new entry before it
    const templateMarker = '## Template for New Issues';
    const templateIndex = content.indexOf(templateMarker);

    if (templateIndex !== -1) {
      // Insert before the template
      content = content.slice(0, templateIndex) + entry + content.slice(templateIndex);
    } else {
      // If no template found, append to end
      content += entry;
    }

    // Write back to file
    fs.writeFileSync(GLITCHES_FILE_PATH, content, 'utf-8');
  } catch (error) {
    console.error('Error appending to glitches file:', error);
    throw error;
  }
}
