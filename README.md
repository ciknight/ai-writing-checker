# AI Writing Checker

## Overview

AI Writing Checker is a web application that leverages multiple AI services (OpenAI, DeepSeek, Claude) to check and improve text content. Users can input text, choose different AI services and models, and receive AI-powered suggestions for improvements.

## Features

- Multiple AI Service Support:
  - OpenAI (GPT-3.5, GPT-4)
  - DeepSeek Chat
  - Claude (Claude-3 Opus, Claude-3 Sonnet, Claude-2.1)
- Real-time Text Difference Comparison
- Local Storage for Settings and API Keys
- Responsive Interface Design
- GitHub Integration

## Project Structure

```
ai-writing-checker
├── src
│   ├── index.html        # HTML structure of the website
│   ├── css
│   │   └── style.css     # Styles for the website
│   └── js
│       └── script.js      # JavaScript for handling user interactions
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ciknight/ai-writing-checker.git
   ```
2. Navigate to the project directory:
   ```
   cd ai-writing-checker
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Open `src/index.html` in your web browser.
2. Enter your OpenAI API key in the designated input field.
3. Select the desired model from the dropdown menu.
4. Input the text you want to check in the textarea.
5. Click the "开始检查" button to initiate the error checking process.
6. View the corrections and suggestions displayed on the right side of the interface.

## License

This project is licensed under the MIT License.
