/*
 * Generate curl test script
 */

export function get_curl_request(env) {
  if( exists(env.parent) )
    env = env.parent;
  
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

Resolvers({curl_request: {
  func: get_curl_request,
  title: 'Curl Request',
  filename: 'curl.sh',
  hidden: true,
  group: 'shell',
  tags: ['string', 'shell'],
  refs: ['llm'],
  text: `Check the connection and model response with a simple test query:`,
  footer: `The LLM reply is interleaved in the output stream and not particularly readable, but will produce errors if there was an issue with the request.`
}});