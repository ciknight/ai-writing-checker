# ai-writing-checker/ai-writing-checker/README.md

# AI Writing Checker

## Overview
AI Writing Checker is a web application that utilizes OpenAI's API to check for errors in user input. The application allows users to input text, select a model, and receive corrections and suggestions from the AI.

## Project Structure
```
ai-writing-checker
├── src
│   ├── index.html        # HTML structure of the website
│   ├── css
│   │   └── style.css     # Styles for the website
│   ├── js
│   │   └── script.js      # JavaScript for handling user interactions
│   └── utils
│       └── api.js        # Utility functions for API requests
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
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