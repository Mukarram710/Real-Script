// Global state
let currentMode = 'balanced';
let currentIntensity = 70;
let isProcessing = false;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    updateInputStats();
    checkButtonState();
});

// Mode selection
function setMode(mode) {
    currentMode = mode;
    
    // Update UI
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`mode-${mode}`).classList.add('active');
}

// Intensity slider
function updateIntensity(value) {
    currentIntensity = parseInt(value);
    document.getElementById('intensity-value').textContent = value;
}

// Calculate text statistics
function getStats(text) {
    if (!text.trim()) {
        return { words: 0, sentences: 0, avgWordsPerSentence: 0 };
    }
    
    const words = text.trim().split(/\s+/).length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
    
    return { words, sentences, avgWordsPerSentence };
}

// Update input statistics
function updateInputStats() {
    const inputText = document.getElementById('input-text').value;
    const stats = getStats(inputText);
    
    let statsText = `${stats.words} words • ${stats.sentences} sentences`;
    if (stats.avgWordsPerSentence > 0) {
        statsText += ` • ${stats.avgWordsPerSentence} avg/sentence`;
    }
    
    document.getElementById('input-stats').textContent = statsText;
    checkButtonState();
}

// Update output statistics
function updateOutputStats() {
    const outputText = document.getElementById('output-text').textContent;
    const stats = getStats(outputText);
    
    let statsText = `${stats.words} words • ${stats.sentences} sentences`;
    if (stats.avgWordsPerSentence > 0) {
        statsText += ` • ${stats.avgWordsPerSentence} avg/sentence`;
    }
    
    document.getElementById('output-stats').textContent = statsText;
}

// Check if button should be enabled
function checkButtonState() {
    const inputText = document.getElementById('input-text').value;
    const btn = document.getElementById('humanize-btn');
    
    if (inputText.trim() && !isProcessing) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Main humanization function
function humanizeText() {
    const inputText = document.getElementById('input-text').value;
    if (!inputText.trim() || isProcessing) return;
    
    isProcessing = true;
    document.getElementById('btn-text').textContent = 'Processing...';
    document.getElementById('humanize-btn').disabled = true;
    
    setTimeout(() => {
        const result = processHumanization(inputText, currentMode, currentIntensity);
        
        const outputElement = document.getElementById('output-text');
        outputElement.textContent = result;
        outputElement.classList.remove('text-gray-400', 'italic');
        outputElement.classList.add('text-gray-800');
        
        document.getElementById('copy-btn').classList.remove('hidden');
        updateOutputStats();
        
        isProcessing = false;
        document.getElementById('btn-text').textContent = 'Humanize Text';
        checkButtonState();
    }, 1000);
}

// Core humanization logic
function processHumanization(text, mode, intensity) {
    if (!text.trim()) return '';
    
    let result = text;
    const intensityFactor = intensity / 100;
    
    // Phase 1: Vary sentence structure
    result = varySentenceStructure(result, mode, intensityFactor);
    
    // Phase 2: Apply contractions
    result = applyContractions(result, mode, intensityFactor);
    
    // Phase 3: Reduce formal language
    result = reduceFormalLanguage(result, intensityFactor);
    
    // Phase 4: Remove AI patterns
    result = removeAIPatterns(result);
    
    // Phase 5: Add natural imperfections
    result = addNaturalImperfections(result, intensityFactor);
    
    // Phase 6: Vary burstiness
    result = varyBurstiness(result, intensityFactor);
    
    // Phase 7: Mode-specific adjustments
    result = applyModeSpecifics(result, mode);
    
    // Phase 8: Final cleanup
    result = finalCleanup(result);
    
    return result;
}

function varySentenceStructure(txt, mode, intensityFactor) {
    const sentences = txt.match(/[^.!?]+[.!?]+/g) || [txt];
    
    return sentences.map((sentence, idx) => {
        const rand = Math.random();
        
        if (rand < 0.15 * intensityFactor && idx > 0) {
            const starters = ['Also, ', 'Plus, ', 'And ', 'But ', 'So ', 'Now, ', 'Then '];
            sentence = starters[Math.floor(Math.random() * starters.length)] + sentence.trim();
        }
        
        if (rand > 0.85 && mode !== 'professional') {
            const interjections = ['honestly', 'actually', 'really', 'clearly', 'obviously'];
            const words = sentence.split(' ');
            const insertPos = Math.floor(words.length * 0.3);
            words.splice(insertPos, 0, interjections[Math.floor(Math.random() * interjections.length)] + ',');
            sentence = words.join(' ');
        }
        
        return sentence;
    }).join(' ');
}

function applyContractions(txt, mode, intensityFactor) {
    const contractions = {
        'do not': "don't", 'does not': "doesn't", 'did not': "didn't",
        'is not': "isn't", 'are not': "aren't", 'was not': "wasn't",
        'were not': "weren't", 'have not': "haven't", 'has not': "hasn't",
        'had not': "hadn't", 'will not': "won't", 'would not': "wouldn't",
        'should not': "shouldn't", 'could not': "couldn't", 'cannot': "can't",
        'can not': "can't", 'I am': "I'm", 'you are': "you're", 'we are': "we're",
        'they are': "they're", 'that is': "that's", 'it is': "it's",
        'he is': "he's", 'she is': "she's", 'what is': "what's",
        'I will': "I'll", 'you will': "you'll", 'we will': "we'll",
        'they will': "they'll", 'I have': "I've", 'you have': "you've",
        'we have': "we've", 'they have': "they've", 'I would': "I'd",
        'you would': "you'd", 'we would': "we'd"
    };
    
    const contractionThreshold = mode === 'casual' ? 0.8 : 
                                 mode === 'professional' ? 0.4 : 0.6;
    
    for (const [formal, casual] of Object.entries(contractions)) {
        const regex = new RegExp('\\b' + formal + '\\b', 'gi');
        txt = txt.replace(regex, (match) => {
            return Math.random() < contractionThreshold * intensityFactor ? casual : match;
        });
    }
    
    return txt;
}

function reduceFormalLanguage(txt, intensityFactor) {
    const replacements = {
        'utilize': 'use',
        'leverage': 'use',
        'facilitate': 'help',
        'implement': 'set up',
        'endeavor': 'try',
        'commence': 'start',
        'conclude': 'end',
        'obtain': 'get',
        'purchase': 'buy',
        'assist': 'help',
        'regarding': 'about',
        'concerning': 'about',
        'pertaining to': 'about',
        'in order to': 'to',
        'due to the fact that': 'because',
        'at this point in time': 'now',
        'for the purpose of': 'to',
        'in the event that': 'if',
        'with regard to': 'about',
        'in accordance with': 'following',
        'subsequent to': 'after',
        'prior to': 'before',
        'in addition': 'also',
        'moreover': 'also',
        'furthermore': 'also',
        'consequently': 'so',
        'therefore': 'so',
        'thus': 'so',
        'nevertheless': 'but',
        'however': 'but',
        'optimize': 'improve',
        'maximize': 'increase',
        'minimize': 'reduce',
        'demonstrate': 'show',
        'indicate': 'show',
        'illustrate': 'show'
    };
    
    for (const [formal, casual] of Object.entries(replacements)) {
        const regex = new RegExp('\\b' + formal + '\\b', 'gi');
        txt = txt.replace(regex, (match) => {
            return Math.random() < intensityFactor ? casual : match;
        });
    }
    
    return txt;
}

function removeAIPatterns(txt) {
    const aiPhrases = {
        'I am writing to inform you that': 'I wanted to let you know',
        'I am writing to': 'I wanted to',
        'Please be advised that': 'Just so you know,',
        'I trust this email finds you well': "Hope you're doing well",
        'I hope this email finds you well': "Hope you're well",
        'I trust you are doing well': "Hope you're doing well",
        'Thank you for your attention to this matter': 'Thanks for looking into this',
        'Please do not hesitate to': 'Feel free to',
        'Do not hesitate to': 'Feel free to',
        'Should you have any questions': 'If you have questions',
        'at your earliest convenience': 'when you can',
        'Please find attached': "I've attached",
        'Attached please find': "I've attached",
        'as per our discussion': 'like we talked about',
        'I look forward to hearing from you': 'Looking forward to hearing from you',
        'I would like to': 'I want to',
        'It is important to note that': 'Note that',
        'It should be noted that': 'Note that',
        'In my opinion': 'I think',
        'In conclusion': 'To wrap up',
        'To summarize': 'In short',
        'It is worth mentioning that': 'Worth noting:',
        'Additionally': 'Also',
        "In today's digital landscape": 'These days',
        "In today's world": 'Today'
    };
    
    for (const [formal, casual] of Object.entries(aiPhrases)) {
        const regex = new RegExp(formal, 'gi');
        txt = txt.replace(regex, casual);
    }
    
    return txt;
}

function addNaturalImperfections(txt, intensityFactor) {
    txt = txt.replace(/\.\s+([A-Z])/g, (match, letter) => {
        if (Math.random() < 0.2 * intensityFactor) {
            return '.\n\n' + letter;
        }
        return match;
    });
    
    const sentences = txt.split(/([.!?]+\s+)/);
    const modified = sentences.map((part, idx) => {
        if (part.trim() && Math.random() < 0.1 * intensityFactor) {
            const words = part.split(' ');
            if (words.length > 8) {
                const dashPos = Math.floor(words.length * 0.5);
                words[dashPos] = '—' + words[dashPos];
                return words.join(' ');
            }
        }
        return part;
    });
    
    return modified.join('');
}

function varyBurstiness(txt, intensityFactor) {
    const sentences = txt.match(/[^.!?]+[.!?]+/g) || [txt];
    
    return sentences.map((sentence, idx) => {
        const words = sentence.trim().split(/\s+/);
        
        if (words.length > 20 && Math.random() < 0.4 * intensityFactor) {
            const breakPoint = Math.floor(words.length / 2);
            const part1 = words.slice(0, breakPoint).join(' ').trim();
            const part2 = words.slice(breakPoint).join(' ').trim();
            return part1 + '. ' + part2.charAt(0).toUpperCase() + part2.slice(1);
        }
        
        if (words.length < 6 && idx < sentences.length - 1 && Math.random() < 0.3 * intensityFactor) {
            const nextSentence = sentences[idx + 1];
            if (nextSentence) {
                const connector = Math.random() > 0.5 ? ', and ' : ' — ';
                return sentence.replace(/[.!?]+\s*$/, connector) + nextSentence.trim().charAt(0).toLowerCase() + nextSentence.trim().slice(1);
            }
        }
        
        return sentence;
    }).join(' ');
}

function applyModeSpecifics(txt, mode) {
    if (mode === 'casual') {
        txt = txt.replace(/\bvery\b/gi, 'really');
        txt = txt.replace(/\bextremely\b/gi, 'super');
        if (Math.random() < 0.3) {
            txt = 'Hey! ' + txt;
        }
    } else if (mode === 'professional') {
        txt = txt.replace(/\bkinda\b/gi, 'kind of');
        txt = txt.replace(/\bgonna\b/gi, 'going to');
        txt = txt.replace(/\bwanna\b/gi, 'want to');
    }
    return txt;
}

function finalCleanup(txt) {
    txt = txt.replace(/\s+/g, ' ');
    txt = txt.replace(/\s+([.,!?])/g, '$1');
    txt = txt.replace(/([.!?])\s*([.!?])/g, '$1');
    txt = txt.replace(/!+/g, '!');
    txt = txt.replace(/\?+/g, '?');
    txt = txt.replace(/\.{4,}/g, '...');
    return txt.trim();
}

// Copy to clipboard
function copyOutput() {
    const outputText = document.getElementById('output-text').textContent;
    
    navigator.clipboard.writeText(outputText).then(() => {
        const copyIcon = document.getElementById('copy-icon');
        copyIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>`;
        copyIcon.classList.remove('text-gray-600');
        copyIcon.classList.add('text-green-600');
        
        setTimeout(() => {
            copyIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>`;
            copyIcon.classList.remove('text-green-600');
            copyIcon.classList.add('text-gray-600');
        }, 2000);
    });
}