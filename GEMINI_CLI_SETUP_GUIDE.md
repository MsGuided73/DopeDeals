# Gemini CLI Setup Guide

## ✅ Installation Complete!

The Google Gemini CLI has been successfully installed on your system.

**Version:** 0.15.3  
**Command:** `gemini`

---

## 🔑 Authentication Setup

To use the Gemini CLI, you need to configure authentication. There are three methods:

### Method 1: API Key (Recommended for Quick Start)

1. **Get your API Key:**
   - Visit: https://aistudio.google.com/app/apikey
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Set the environment variable:**

   **Option A: PowerShell (Current Session Only):**
   ```powershell
   $env:GEMINI_API_KEY = "your-api-key-here"
   ```

   **Option B: PowerShell (Permanent - User Level):**
   ```powershell
   [System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', 'your-api-key-here', 'User')
   ```
   *Note: Restart your terminal after setting permanent variables*

   **Option C: Add to .env file (if using in Node.js projects):**
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```
   *Note: In .env files, do NOT use quotes around the value*

   **Option D: Command Prompt:**
   ```cmd
   setx GEMINI_API_KEY "your-api-key-here"
   ```

3. **Or create a Gemini CLI settings file:**
   - Location: `C:\Users\benso\.gemini\settings.json`
   - Content:
   ```json
   {
     "apiKey": "your-api-key-here"
   }
   ```
   *Note: In JSON files, quotes ARE required*

### Method 2: Vertex AI (For Google Cloud Users)

Set the environment variable:
```powershell
$env:GOOGLE_GENAI_USE_VERTEXAI = "true"
```

### Method 3: Google Cloud Authentication (GCA)

Set the environment variable:
```powershell
$env:GOOGLE_GENAI_USE_GCA = "true"
```

---

## 🚀 Usage Examples

### Interactive Mode (Default)
Launch an interactive chat session:
```bash
gemini
```

### One-Shot Prompt
Ask a single question:
```bash
gemini "What is the capital of France?"
```

### Prompt with Interactive Follow-up
Start with a prompt and continue interacting:
```bash
gemini -i "Help me write a function"
```

### Specify a Model
Use a specific Gemini model:
```bash
gemini -m gemini-2.0-flash-exp "Explain quantum computing"
```

### YOLO Mode (Auto-approve all actions)
⚠️ Use with caution - automatically approves all tool executions:
```bash
gemini -y "Create a new file"
```

### Auto-approve Edit Tools Only
Automatically approve file edits but prompt for other actions:
```bash
gemini --approval-mode auto_edit "Refactor this code"
```

### Resume Previous Session
Continue from your last session:
```bash
gemini -r latest
```

Or resume a specific session:
```bash
gemini -r 5
```

### List Available Sessions
```bash
gemini --list-sessions
```

### Delete a Session
```bash
gemini --delete-session 3
```

---

## 🔧 Advanced Features

### MCP Server Management
Manage Model Context Protocol servers:
```bash
gemini mcp
```

### Extensions
List available extensions:
```bash
gemini -l
```

Use specific extensions:
```bash
gemini -e extension1,extension2
```

Manage extensions:
```bash
gemini extensions <command>
```

### Include Additional Directories
Add extra directories to the workspace context:
```bash
gemini --include-directories ./docs,./tests
```

### Output Formats
- **Text (default):** Human-readable output
- **JSON:** Machine-readable output
- **Stream JSON:** Streaming JSON output

```bash
gemini -o json "What is AI?"
```

### Screen Reader Mode
Enable accessibility features:
```bash
gemini --screen-reader
```

### Debug Mode
Run with detailed debugging information:
```bash
gemini -d "Debug this issue"
```

---

## 📝 Configuration File

The Gemini CLI uses a configuration file located at:
```
C:\Users\benso\.gemini\settings.json
```

Example configuration:
```json
{
  "apiKey": "your-api-key-here",
  "model": "gemini-2.0-flash-exp",
  "approvalMode": "default",
  "extensions": ["extension1", "extension2"]
}
```

---

## 🎯 Quick Start Checklist

- [x] Install Gemini CLI (`npm install -g @google/gemini-cli`)
- [ ] Get API Key from https://aistudio.google.com/app/apikey
- [ ] Set `GEMINI_API_KEY` environment variable
- [ ] Test with: `gemini "Hello, Gemini!"`
- [ ] Explore interactive mode: `gemini`

---

## 🆘 Troubleshooting

### "Command not found" Error
- Restart your terminal after installation
- Check if npm global bin is in your PATH: `npm config get prefix`

### Authentication Errors
- Verify your API key is correct
- Check environment variable is set: `echo $env:GEMINI_API_KEY` (PowerShell)
- Ensure settings.json has correct format (with quotes around the value)
- If using .env file, ensure NO quotes around the value

### Permission Issues
- Run PowerShell as Administrator if setting system-wide variables
- Check file permissions on `.gemini` directory

### .env File Not Working
- The Gemini CLI doesn't automatically read `.env` files
- Use environment variables or the settings.json file instead
- If you need .env support, use a tool like `dotenv-cli`: `dotenv gemini`

---

## 📚 Additional Resources

- **Official Documentation:** https://github.com/google-gemini/gemini-cli
- **API Documentation:** https://ai.google.dev/docs
- **Get API Key:** https://aistudio.google.com/app/apikey
- **Report Issues:** https://github.com/google-gemini/gemini-cli/issues

---

## 💡 Tips & Best Practices

1. **Start Simple:** Begin with basic prompts to understand the CLI behavior
2. **Use Interactive Mode:** Great for iterative development and exploration
3. **Session Management:** Use `--resume` to continue previous conversations
4. **Approval Modes:** Start with default mode, use auto_edit for trusted operations
5. **Model Selection:** Different models have different capabilities and costs
6. **Context Awareness:** The CLI is aware of your current directory and files
7. **Extensions:** Explore available extensions to enhance functionality

---

## 📋 Environment Variable Format Reference

**Different contexts require different formats:**

| Context | Format | Example |
|---------|--------|---------|
| `.env` file | `KEY=value` (no quotes) | `GEMINI_API_KEY=abc123xyz` |
| PowerShell | `$env:KEY = "value"` | `$env:GEMINI_API_KEY = "abc123xyz"` |
| JSON file | `"key": "value"` | `"apiKey": "abc123xyz"` |
| Bash/Linux | `export KEY="value"` | `export GEMINI_API_KEY="abc123xyz"` |

**Important:** The Gemini CLI reads from:
1. Environment variables (set in terminal)
2. Settings file at `C:\Users\benso\.gemini\settings.json`
3. It does NOT automatically read `.env` files

---

## 🎉 You're All Set!

The Gemini CLI is now installed and ready to use. Once you configure authentication, you can start using it immediately!

**Next Step:** Get your API key and set the `GEMINI_API_KEY` environment variable.
