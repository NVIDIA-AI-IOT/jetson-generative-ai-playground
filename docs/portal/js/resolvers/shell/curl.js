/*
 * Generate curl test script
 */

export function get_curl_chat(env) {
  const code = 
  `curl http://${env.server_host}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${TEST_KEY}" \\
  -d '{
    "model": "${TEST_MODEL}",
    "messages": [{"role":"user","content":"${TEST_PROMPT}"}],${GenerationConfig({env:env, indent: 4, assign: ': ', quote: '\"'})}
    "stream": true                
  }'`;

  return code;
}

Resolvers({curl_chat: {
  func: get_curl_chat,
  title: 'Curl Test',
  filename: 'curl.sh',
  hidden: true,
  tags: ['string', 'shell'],
  text: `Check the connection and model response with a simple test query:`,
  footer: `The LLM reply is interleaved in the output stream and not particularly readable, but will produce errors if there was an issue with the request.`
}});