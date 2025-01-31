const ENDPOINTS = {
    openai: 'https://api.openai.com/v1/chat/completions',
    deepseek: 'https://api.deepseek.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages'
};

const PROMPTS = {
    openai: "请帮我检查以下文章，找出错误并修正。请直接返回修改后的完整文本，不要包含任何其他内容：\n\n",
    deepseek: "请帮我检查以下文章，找出错误并修正。请直接返回修改后的完整文本，不要包含任何其他内容：\n\n",
    claude: "请帮我检查以下文章，找出错误并修正。请直接返回修改后的完整文本，不要包含任何其他内容：\n\n"
};

function saveApiKey(apiKey) {
    localStorage.setItem('aiWritingCheckerApiKey', apiKey);
}

function loadApiKey() {
    return localStorage.getItem('aiWritingCheckerApiKey') || '';
}

function saveSettings(serviceType, model) {
    localStorage.setItem('aiWritingCheckerService', serviceType);
    localStorage.setItem('aiWritingCheckerModel', model);
}

function loadSettings() {
    return {
        serviceType: localStorage.getItem('aiWritingCheckerService') || 'openai',
        model: localStorage.getItem('aiWritingCheckerModel') || 'gpt-3.5-turbo'
    };
}

// Modify updateModelOptions to save settings
function updateModelOptions() {
    const serviceType = document.getElementById('serviceType').value;
    const modelSelect = document.getElementById('model');
    const openaiModels = document.querySelectorAll('.openai-model');
    const deepseekModels = document.querySelectorAll('.deepseek-model');
    const claudeModels = document.querySelectorAll('.claude-model');

    // Hide all models first
    [openaiModels, deepseekModels, claudeModels].forEach(models => {
        models.forEach(option => option.style.display = 'none');
    });

    // Show relevant models
    switch (serviceType) {
        case 'openai':
            openaiModels.forEach(option => option.style.display = 'block');
            modelSelect.value = 'gpt-3.5-turbo';
            break;
        case 'deepseek':
            deepseekModels.forEach(option => option.style.display = 'block');
            modelSelect.value = 'deepseek-chat';
            break;
        case 'claude':
            claudeModels.forEach(option => option.style.display = 'block');
            modelSelect.value = 'claude-3-sonnet-20240229';
            break;
    }

    // Save settings after updating
    saveSettings(serviceType, modelSelect.value);
}

function checkText() {
    const apiKey = document.getElementById('apiKey').value;
    // Save API key when making a request
    if (apiKey) {
        saveApiKey(apiKey);
    }
    const model = document.getElementById('model').value;
    const userInput = document.getElementById('userInput').value;
    const serviceType = document.getElementById('serviceType').value;

    if (!apiKey || !userInput) {
        alert('请填写API密钥和要检查的文本。');
        return;
    }

    document.querySelector('.loading').style.display = 'block';
    document.querySelector('.error').style.display = 'none';
    document.querySelector('.corrections').innerHTML = '';

    const requestBody = getRequestBody(serviceType, model, userInput);
    const headers = getHeaders(serviceType, apiKey);

    fetch(ENDPOINTS[serviceType], {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
    })
        .then(response => response.json())
        .then(data => handleResponse(data, serviceType))
        .catch(handleError);
}

function getRequestBody(serviceType, model, userInput) {
    const prompt = PROMPTS[serviceType] + "\n\n" + userInput;

    switch (serviceType) {
        case 'claude':
            return {
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 4000,
                temperature: 0.7
            };
        case 'openai':
        case 'deepseek':
            return {
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 2000
            };
        default:
            return {
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }]
            };
    }
}

function getHeaders(serviceType, apiKey) {
    const headers = {
        'Content-Type': 'application/json'
    };

    switch (serviceType) {
        case 'claude':
            headers['x-api-key'] = apiKey;
            headers['anthropic-version'] = '2023-06-01';
            break;
        default:
            headers['Authorization'] = `Bearer ${apiKey}`;
    }

    return headers;
}

// Add after existing code but before handleResponse
function highlightDifferences(originalText, modifiedText) {
    function normalizeText(text) {
        return text
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function tokenize(text) {
        const normalized = normalizeText(text);
        return normalized.match(/[\u4e00-\u9fa5]|[a-zA-Z]+|[\s]|[^\s\u4e00-\u9fa5a-zA-Z]/g) || [];
    }

    function wrapWithSpan(text, type) {
        return `<span class="${type}">${text}</span>`;
    }

    function compareTokens(originalTokens, modifiedTokens) {
        let result = '';
        let i = 0, j = 0;
        let deletions = '';
        let additions = '';

        while (i < originalTokens.length || j < modifiedTokens.length) {
            if (i >= originalTokens.length) {
                if (deletions) result += wrapWithSpan(deletions, 'delete');
                if (additions) result += wrapWithSpan(additions, 'add');
                while (j < modifiedTokens.length) additions += modifiedTokens[j++];
                if (additions) result += wrapWithSpan(additions, 'add');
                break;
            } else if (j >= modifiedTokens.length) {
                if (deletions) result += wrapWithSpan(deletions, 'delete');
                if (additions) result += wrapWithSpan(additions, 'add');
                while (i < originalTokens.length) deletions += originalTokens[i++];
                if (deletions) result += wrapWithSpan(deletions, 'delete');
                break;
            }

            if (originalTokens[i] === modifiedTokens[j]) {
                if (deletions) result += wrapWithSpan(deletions, 'delete');
                if (additions) result += wrapWithSpan(additions, 'add');
                deletions = '';
                additions = '';
                result += originalTokens[i];
                i++;
                j++;
            } else {
                deletions += originalTokens[i];
                additions += modifiedTokens[j];
                i++;
                j++;
            }
        }
        return result;
    }

    // Split into paragraphs and compare each
    const originalParagraphs = originalText.split(/\n+/);
    const modifiedParagraphs = modifiedText.split(/\n+/);
    const maxLength = Math.max(originalParagraphs.length, modifiedParagraphs.length);
    const resultParagraphs = [];

    for (let i = 0; i < maxLength; i++) {
        const originalPara = originalParagraphs[i] || '';
        const modifiedPara = modifiedParagraphs[i] || '';
        const originalTokens = tokenize(originalPara);
        const modifiedTokens = tokenize(modifiedPara);
        console.log(originalTokens, modifiedTokens);
        const diffResult = compareTokens(originalTokens, modifiedTokens);
        resultParagraphs.push(diffResult);
    }

    return resultParagraphs.join('<br><br>');
}


function handleResponse(data, serviceType) {
    document.querySelector('.loading').style.display = 'none';

    try {
        let modifiedText = '';
        if (serviceType === 'claude') {
            modifiedText = data.content?.[0]?.text?.trim();
        } else {
            modifiedText = data.choices?.[0]?.message?.content?.trim();
        }

        if (!modifiedText) {
            throw new Error('无法获取修改后的文本');
        }

        // Remove any markdown or formatting
        modifiedText = modifiedText.replace(/^修改后文本：/i, '')
            .replace(/^\[|\]$/g, '')
            .trim();

        const originalText = document.getElementById('userInput').value;
        const highlightedDiff = highlightDifferences(originalText, modifiedText);
        document.querySelector('.corrections').innerHTML = highlightedDiff;
    } catch (error) {
        document.querySelector('.error').innerText = '处理响应时出错：' + error.message;
        document.querySelector('.error').style.display = 'block';
    }
}

function handleError(error) {
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.error').innerText = '发生错误：' + error.message;
    document.querySelector('.error').style.display = 'block';
}

// Add event listener for service type change
document.getElementById('serviceType').addEventListener('change', updateModelOptions);
// Initialize model options on page load
document.addEventListener('DOMContentLoaded', () => {
    const settings = loadSettings();
    const savedApiKey = loadApiKey();

    // Set saved values
    if (savedApiKey) {
        document.getElementById('apiKey').value = savedApiKey;
    }
    if (settings.serviceType) {
        document.getElementById('serviceType').value = settings.serviceType;
    }

    // Update model options first
    updateModelOptions();

    // Then set saved model if exists
    if (settings.model) {
        document.getElementById('model').value = settings.model;
    }
});

// Add API key input event listener
document.getElementById('apiKey').addEventListener('change', (e) => {
    saveApiKey(e.target.value);
});

// Add model change listener
document.getElementById('model').addEventListener('change', (e) => {
    const serviceType = document.getElementById('serviceType').value;
    saveSettings(serviceType, e.target.value);
});