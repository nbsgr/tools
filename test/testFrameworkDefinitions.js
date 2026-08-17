// testFrameworkDefinitions.js — Detailed validation for framework tool definition exports in coderun-tools
import coderunTools, {
  getOpenAiAgentsDefinitions,
  getGeminiAdkDefinitions,
  getLangchainDefinitions
} from '../index.js';

console.log('====================================================');
console.log('🧪 Testing Framework Tool Definitions for coderun-tools');
console.log('====================================================\n');

var passed = 0;
var failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  ✅ PASS: ' + message);
    passed++;
  } else {
    console.log('  ❌ FAIL: ' + message);
    failed++;
  }
}

async function runTests() {
  try {
    // 1. OpenAI Agents SDK Definitions
    console.log('--- Test 1: getOpenAiAgentsDefinitions ---');
    var openAiDefs = getOpenAiAgentsDefinitions();
    assert(Array.isArray(openAiDefs) && openAiDefs.length === 19, 'Returns array of 19 OpenAI Agents tool definitions');

    var sampleOpenAi = openAiDefs[0];
    assert(typeof sampleOpenAi.name === 'string' && sampleOpenAi.name.length > 0, 'Tool has valid name: ' + sampleOpenAi.name);
    assert(typeof sampleOpenAi.description === 'string', 'Tool has valid description');
    assert(typeof sampleOpenAi.parameters === 'object' && sampleOpenAi.parameters.type === 'object', 'Tool has valid JSON Schema parameters');
    assert(typeof sampleOpenAi.execute === 'function', 'Tool has valid executable handler function');

    // Test executing read_file via OpenAI handler
    var openAiExecResult = await sampleOpenAi.execute({ path: 'package.json' });
    assert(typeof openAiExecResult === 'string' && openAiExecResult.indexOf('coderun-tools') !== -1, 'OpenAI execute handler resolves to string content');

    // 2. Gemini ADK Definitions
    console.log('\n--- Test 2: getGeminiAdkDefinitions ---');
    var geminiDefs = getGeminiAdkDefinitions();
    assert(Array.isArray(geminiDefs) && geminiDefs.length === 19, 'Returns array of 19 Gemini ADK tool definitions');

    var sampleGemini = geminiDefs[0];
    assert(typeof sampleGemini.name === 'string', 'Gemini tool has valid name');
    assert(typeof sampleGemini.parameters === 'object', 'Gemini tool has valid parameters object');
    assert(typeof sampleGemini.execute === 'function', 'Gemini tool has valid execute function');

    var geminiExecResult = await sampleGemini.execute({ path: 'package.json' });
    assert(geminiExecResult.output && geminiExecResult.output.success === true, 'Gemini execute handler resolves to structured result');

    // 3. LangChain Definitions
    console.log('\n--- Test 3: getLangchainDefinitions ---');
    var langchainDefs = getLangchainDefinitions();
    assert(Array.isArray(langchainDefs) && langchainDefs.length === 19, 'Returns array of 19 LangChain tool definitions');

    var sampleLangChain = langchainDefs[0];
    assert(typeof sampleLangChain.name === 'string', 'LangChain tool has valid name');
    assert(typeof sampleLangChain.schema === 'object', 'LangChain tool has valid schema object');
    assert(typeof sampleLangChain.func === 'function', 'LangChain tool has valid func function');

    var langchainExecResult = await sampleLangChain.func({ path: 'package.json' });
    assert(typeof langchainExecResult === 'string', 'LangChain func handler resolves to string output');

  } catch (err) {
    console.error('  ❌ EXCEPTION in test:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log('📊 Framework Definition Test Summary: ' + passed + ' Passed, ' + failed + ' Failed');
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
