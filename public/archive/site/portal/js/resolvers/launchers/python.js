/*
 * Python example
 */

export function python_chat(env) {
  const root = exists(env.parent) ? env.parent : env;

  const code = 
`# use 'pip install openai' before running this
from openai import OpenAI

client = OpenAI(
  base_url = '${get_server_url(env)}v1',
  api_key = 'foo' # not enforced
)

chat = [{
  'role': 'user',
  'content': '${TEST_PROMPT}'
}]

completion = client.chat.completions.create(
  model=\'default\', # not enforced
  messages=chat,${GenerationConfig({env:env})}
  stream=True
)

for chunk in completion:
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end='')
`;

  return code;
}


Resolver({
  func: python_chat,
  title: 'Python',
  filename: 'llm.py',
  hidden: true,
  group: ['python'],
  refs: ['llm'],
  tags: ['python'],
  text: [
    `This standalone Python example sends a <a href="https://platform.openai.com/docs/api-reference/chat/create" target="_blank" class="code">chat.completion</a> request to a LLM server and streams the response.`,
    `You can run this outside of container with minimal dependencies to install, or from other devices on your LAN.`
  ].join(' '),
  footer: [
    `For API documentation of the OpenAI Python client library, see:<br/>&nbsp;&nbsp;&nbsp;`,
    `<a href="https://github.com/openai/openai-python" target="_blank" class="code">https://github.com/openai/openai-python</a><br/>&nbsp;&nbsp;&nbsp;`,
    `<a href="https://platform.openai.com/docs/api-reference" target="_blank" class="code">https://platform.openai.com/docs/api-reference</a>`
  ].join(' ')
});