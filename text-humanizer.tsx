import React, { useState } from 'react';
import { Wand2, Copy, Check, Settings, Zap, FileText } from 'lucide-react';

export default function HumanizationEngine() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('balanced');
  const [intensity, setIntensity] = useState(70);

  const humanizeText = (text, selectedMode, selectedIntensity) => {
    if (!text.trim()) return '';

    let result = text;
    const intensityFactor = selectedIntensity / 100;

    // PHASE 1: Sentence Structure Variation
    const varySentenceStructure = (txt) => {
      const sentences = txt.match(/[^.!?]+[.!?]+/g) || [txt];
      return sentences.map((sentence, idx) => {
        const rand = Math.random();
        
        // Randomly vary sentence beginnings
        if (rand < 0.15 * intensityFactor && idx > 0) {
          const starters = ['Also, ', 'Plus, ', 'And ', 'But ', 'So ', 'Now, ', 'Then '];
          sentence = starters[Math.floor(Math.random() * starters.length)] + sentence.trim();
        }
        
        // Add occasional interjections
        if (rand > 0.85 && selectedMode !== 'professional') {
          const interjections = ['honestly', 'actually', 'really', 'clearly', 'obviously'];
          const words = sentence.split(' ');
          const insertPos = Math.floor(words.length * 0.3);
          words.splice(insertPos, 0, interjections[Math.floor(Math.random() * interjections.length)] + ',');
          sentence = words.join(' ');
        }
        
        return sentence;
      }).join(' ');
    };

    // PHASE 2: Contraction Application (with controlled randomness)
    const applyContractions = (txt) => {
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

      const contractionThreshold = selectedMode === 'casual' ? 0.8 : 
                                   selectedMode === 'professional' ? 0.4 : 0.6;

      for (const [formal, casual] of Object.entries(contractions)) {
        const regex = new RegExp('\\b' + formal + '\\b', 'gi');
        txt = txt.replace(regex, (match) => {
          return Math.random() < contractionThreshold * intensityFactor ? casual : match;
        });
      }
      return txt;
    };

    // PHASE 3: Formality Reduction
    const reduceFormalLanguage = (txt) => {
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
    };

    // PHASE 4: Remove AI-typical phrases
    const removeAIPatterns = (txt) => {
      const aiPhrases = {
        'I am writing to inform you that': 'I wanted to let you know',
        'I am writing to': 'I wanted to',
        'Please be advised that': 'Just so you know,',
        'I trust this email finds you well': 'Hope you\'re doing well',
        'I hope this email finds you well': 'Hope you\'re well',
        'I trust you are doing well': 'Hope you\'re doing well',
        'Thank you for your attention to this matter': 'Thanks for looking into this',
        'Please do not hesitate to': 'Feel free to',
        'Do not hesitate to': 'Feel free to',
        'Should you have any questions': 'If you have questions',
        'at your earliest convenience': 'when you can',
        'Please find attached': 'I\'ve attached',
        'Attached please find': 'I\'ve attached',
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
        'In today\'s digital landscape': 'These days',
        'In today\'s world': 'Today'
      };

      for (const [formal, casual] of Object.entries(aiPhrases)) {
        const regex = new RegExp(formal, 'gi');
        txt = txt.replace(regex, casual);
      }
      return txt;
    };

    // PHASE 5: Add Natural Imperfections
    const addNaturalImperfections = (txt) => {
      // Vary paragraph breaks naturally
      txt = txt.replace(/\.\s+([A-Z])/g, (match, letter) => {
        if (Math.random() < 0.2 * intensityFactor) {
          return '.\n\n' + letter;
        }
        return match;
      });

      // Occasionally use em dashes for emphasis
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
    };

    // PHASE 6: Vary Sentence Length (burstiness)
    const varyBurstiness = (txt) => {
      const sentences = txt.match(/[^.!?]+[.!?]+/g) || [txt];
      
      return sentences.map((sentence, idx) => {
        const words = sentence.trim().split(/\s+/);
        
        // Occasionally break long sentences
        if (words.length > 20 && Math.random() < 0.4 * intensityFactor) {
          const breakPoint = Math.floor(words.length / 2);
          const part1 = words.slice(0, breakPoint).join(' ').trim();
          const part2 = words.slice(breakPoint).join(' ').trim();
          return part1 + '. ' + part2.charAt(0).toUpperCase() + part2.slice(1);
        }
        
        // Occasionally combine short sentences
        if (words.length < 6 && idx < sentences.length - 1 && Math.random() < 0.3 * intensityFactor) {
          const nextSentence = sentences[idx + 1];
          if (nextSentence) {
            const connector = Math.random() > 0.5 ? ', and ' : ' — ';
            return sentence.replace(/[.!?]+\s*$/, connector) + nextSentence.trim().charAt(0).toLowerCase() + nextSentence.trim().slice(1);
          }
        }
        
        return sentence;
      }).join(' ');
    };

    // PHASE 7: Mode-specific adjustments
    const applyModeSpecifics = (txt, selectedMode) => {
      if (selectedMode === 'casual') {
        // Add more personality
        txt = txt.replace(/\bvery\b/gi, 'really');
        txt = txt.replace(/\bextremely\b/gi, 'super');
        // Add occasional casual expressions
        if (Math.random() < 0.3) {
          txt = 'Hey! ' + txt;
        }
      } else if (selectedMode === 'professional') {
        // Keep more formal but still natural
        txt = txt.replace(/\bkinda\b/gi, 'kind of');
        txt = txt.replace(/\bgonna\b/gi, 'going to');
        txt = txt.replace(/\bwanna\b/gi, 'want to');
      }
      return txt;
    };

    // PHASE 8: Final cleanup
    const finalCleanup = (txt) => {
      // Fix spacing issues
      txt = txt.replace(/\s+/g, ' ');
      txt = txt.replace(/\s+([.,!?])/g, '$1');
      txt = txt.replace(/([.!?])\s*([.!?])/g, '$1');
      // Remove excessive punctuation
      txt = txt.replace(/!+/g, '!');
      txt = txt.replace(/\?+/g, '?');
      txt = txt.replace(/\.{4,}/g, '...');
      return txt.trim();
    };

    // Apply all transformations
    result = varySentenceStructure(result);
    result = applyContractions(result);
    result = reduceFormalLanguage(result);
    result = removeAIPatterns(result);
    result = addNaturalImperfections(result);
    result = varyBurstiness(result);
    result = applyModeSpecifics(result, selectedMode);
    result = finalCleanup(result);

    return result;
  };

  const handleHumanize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const humanized = humanizeText(inputText, mode, intensity);
      setOutputText(humanized);
      setIsProcessing(false);
    }, 1000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStats = (text) => {
    const words = text.trim().split(/\s+/).length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const avgWordsPerSentence = sentences > 0 ? Math.round(words / sentences) : 0;
    return { words, sentences, avgWordsPerSentence };
  };

  const inputStats = getStats(inputText);
  const outputStats = getStats(outputText);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Zap className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Humanization Engine
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced AI text transformation for natural, human-like writing. Perfect for marketing copy, content writing, and research-based articles.
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Writing Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode('professional')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'professional'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Professional
                </button>
                <button
                  onClick={() => setMode('balanced')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'balanced'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Balanced
                </button>
                <button
                  onClick={() => setMode('casual')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'casual'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Casual
                </button>
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Humanization Intensity: {intensity}%
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Subtle</span>
                <span>Moderate</span>
                <span>Aggressive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Input Text
              </h2>
              <div className="text-sm text-gray-500">
                {inputStats.words} words • {inputStats.sentences} sentences
                {inputStats.avgWordsPerSentence > 0 && ` • ${inputStats.avgWordsPerSentence} avg/sentence`}
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your AI-generated text here... Whether it's a cold email, blog post, article, or research content."
              className="w-full h-96 p-4 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          {/* Output */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Humanized Output
              </h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">
                  {outputStats.words} words • {outputStats.sentences} sentences
                  {outputStats.avgWordsPerSentence > 0 && ` • ${outputStats.avgWordsPerSentence} avg/sentence`}
                </div>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="w-full h-96 p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg overflow-y-auto">
              {outputText ? (
                <p className="text-gray-800 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {outputText}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Your humanized text will appear here...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleHumanize}
            disabled={!inputText.trim() || isProcessing}
            className="px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 flex items-center gap-3 mx-auto text-lg"
          >
            <Zap className="w-6 h-6" />
            {isProcessing ? 'Processing...' : 'Humanize Text'}
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Smart Contractions</h4>
            <p className="text-sm text-gray-600">Applies natural contractions based on context and style</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-800 mb-2">📊 Burstiness Control</h4>
            <p className="text-sm text-gray-600">Varies sentence length for natural rhythm and flow</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h4 className="font-semibold text-gray-800 mb-2">✨ Pattern Breaking</h4>
            <p className="text-sm text-gray-600">Removes predictable AI writing patterns</p>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Best Practices for Authentic Content
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-purple-700 mb-2">For Marketing:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Add specific details about your product/service</li>
                <li>• Include genuine customer testimonials or data</li>
                <li>• Personalize with recipient research</li>
                <li>• Test multiple variations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-700 mb-2">For Content Writing:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Add your unique insights and analysis</li>
                <li>• Include personal anecdotes or examples</li>
                <li>• Fact-check all AI-generated information</li>
                <li>• Inject your authentic voice and perspective</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              <strong>Remember:</strong> This tool helps make AI-assisted writing sound more natural, but the best content always includes your genuine knowledge, research, and perspective. Use AI for ideation and drafting, then add your authentic voice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}