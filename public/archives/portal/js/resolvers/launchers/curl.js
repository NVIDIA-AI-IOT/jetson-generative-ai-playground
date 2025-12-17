/*
 * Generate curl test script
 */

export function curl_llm(env) {
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

export function curl_vlm(env) {
  if( exists(env.parent) )
    env = env.parent;

  const code =
  `curl http://${env.server_host}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{
      "role": "user",
      "content": [{
        "type": "text",
        "text": "What is in this image?"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
        }
      }
    ]}],
    "max_tokens": 300
  }'`;

  return code;
}

Resolvers({
  curl_request: {
    func: curl_llm,
    title: 'Curl Request',
    filename: 'curl.sh',
    hidden: true,
    group: 'shell',
    tags: ['string', 'shell'],
    refs: ['llm'],
    text: `Check the connection and model response with a simple test query:`,
    footer: `The LLM reply is interleaved in the output stream and not particularly readable, but will produce errors if there was an issue with the request.`
  },
  curl_vlm: {
    func: curl_vlm,
    title: 'Curl Request',
    filename: 'curl-vlm.sh',
    hidden: true,
    group: 'shell',
    tags: ['string', 'shell'],
    refs: ['vlm'],
    text: `This curl query is for vision/language models and uses images in the prompt:`,
    footer: `<b>Note:</b> for ollama, see the Python examples that use base64 encoding instead.`
  },
});