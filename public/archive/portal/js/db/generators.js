/*
 * Templates that generate docker service configs, code examples, docs, ect.
 * for launching containers, jobs, or initiating workflow actions.
 */ 
import {
  exists, wrapLines, is_list, is_string, 
  nonempty, make_url
} from '../nanolab.js';


/* 
 * config pages for docker, python, javascript, shell 
 */
export function ModelGenerator(args) {
  args.env ??= {pages: {}, properties: {}};

  EnvGenerator(args);
  DockerGenerator(args);
  PythonGenerator(args);
  //JavascriptGenerator(args);

  if( !exists(ValidatePages(args)) ) {
    console.log(`Failed to generate valid pages`, args);
    return null;
  }
    
  console.log(`[ConfigGenerator] generated configs for '${args.key}'`, args.env);
  return args.env;
}

/*
 * fold/resolve properties into environment
 */
export function EnvGenerator({db, key, env}) {
  env ??= {pages: {}, properties: {}};

  if( nonempty(db.props[key]) ) {
    for( const field_key of db.props[key] ) {
      env.properties[field_key] = db.flatten({key: key, property: field_key});
      env[field_key] = env.properties[field_key].value;
    }
  }

  for( const prop_key in db.flat[key] ) {
    if( !(prop_key in env) )
      env[prop_key] = db.flat[key][prop_key];
  }

  // using the little cleaner key led to issues with it not lining up with filesystems
  env.model_name ??= get_model_name(env.url) ?? key; // key; 
  return env;
}

/*
 * docker run + compose
 */
export function DockerGenerator({db, key, env}) {

  if( !(key in db.ancestors) || !db.ancestors[key].includes('container') )
    return env;

  console.log('DockerGenerator', env);

  let opt = env.container_options ?? '';

  if( exists(env.CUDA_VISIBLE_DEVICES) ) {
    const tr = env.CUDA_VISIBLE_DEVICES.trim();
    if( tr.length > 0 )
      opt += ` --gpus ${tr} `;
  }

  if( exists(env.server_host) ) {
    var server_url = new URL('http://' + env.server_host);
    opt += `-p ${server_url.port}:${server_url.port} `;
  }
  else {
    opt += '--network host ';
  }

  if( !exists(env.auto_update) || env.auto_update != 'off' ) {
    opt += `--pull always -e DOCKER_PULL=on `;
  }

  if( exists(env.hf_token) ) {
    const tr = env.hf_token.trim();
    if( tr.length > 0 ) {
      var hf_token = `-e HF_TOKEN=${env.hf_token} `;
      opt += hf_token;
    }
  }

  if( exists(env.cache_dir) ) {
    const tr = env.cache_dir.trim();
    if( tr.length > 0 ) {
      var cache_dir = `-v ${tr}:/root/.cache `;
      var hf_hub_dir = `-e HF_HUB_CACHE=/root/.cache/huggingface `;
      opt += hf_hub_dir + cache_dir;
    }
  }

  const DEBUG=``; //`-v /mnt/NVME/repos/sudonim/sudonim:/usr/local/bin/sudonim `;

  if( nonempty(DEBUG) )
    opt += DEBUG;

  opt = wrapLines(opt) + ' \\\n ';

  const image = `${env.container_image} \\\n   `; 

  const model_api = get_model_api(env.url ?? env.model_name)
  const model_repo = get_model_repo(env.url ?? env.model_name);

  let args = ` \\
      --model ${model_repo} \\
      --quantization ${env.quantization} \\
      --max-batch-size ${env.max_batch_size}`;

  if( exists(env.max_context_len) ) {
    args += ` \\
      --max-context-len ${env.max_context_len}`;
  }

  if( exists(env.prefill_chunk) ) {
    args += ` \\
      --prefill-chunk ${env.prefill_chunk}`;
  }

  if( exists(env.chat_template) ) {
    args += ` \\
      --chat-template ${env.chat_template}`;
  }

  if( exists(server_url) ) {
    args += ` \\
      --host ${server_url.hostname} \\
      --port ${server_url.port}`;
  }

  if( exists(env.container_args) ) {
    args += ` \\
        ${env.container_args}`;
  }

  let cmd = env.container_cmd
    .trim()
    .replace('$OPTIONS', '${OPTIONS}')
    .replace('$IMAGE', '${IMAGE}')
    .replace('$ARGS', '${ARGS}');

  if( !cmd.endsWith('${ARGS}') )
    args += ` \\\n      `;  // line break for user args

  cmd = `docker run ${cmd}`
    .replace('${OPTIONS}', opt)
    .replace('${IMAGE}', image)
    .replace('${ARGS}', args)
    .replace('\\ ', '\\')
    .replace('  \\', ' \\');

  /*config.warnings = {
    name: 'warnings',
    lang: 'markdown',
    code: '* ABC123\n** DEF'
  }*/

  env.pages.docker_run = {
    name: 'docker run',
    lang: 'shell',
    code: cmd,
    header: '# Run this on your Jetson to prepare the model and\n# start chat.completion server. Then run curl to test.'
  };

  CurlGenerator({db:db, key:key, env:env})

  var compose = composerize(env.pages.docker_run.code, null, 'latest', 2); // this gets imported globally by nanolab.js
  compose = compose.substring(compose.indexOf("\n") + 1); // first line from composerize is an unwanted name
  compose = `# Save as compose.yml and run 'docker compose up'\n` +
    `# To benchmark: docker compose --profile perf_bench up\n` + 
    (model_api === 'llama.cpp' ? '# With llama.cpp backend, you may encounter request ack/response errors (these can safely be ignored during the benchmark)\n' : '') 
    + compose;

  compose += `\n    healthcheck:`;
  compose += `\n      test: ["CMD", "curl", "-f", "http://${server_url.hostname}:${server_url.port}/v1/models"]`;
  compose += `\n      interval: 20s`;
  compose += `\n      timeout: 60s`;
  compose += `\n      retries: 45`;    
  compose += `\n      start_period: 15s`; 
  
  env.pages.docker_compose = {
    name: 'compose',
    lang: 'yaml',
    code: compose
  };

  //
  // Generate alternate docker-compose profiles that support additional tasks/workflows:  
  //
  //    --profile perf_bench
  //    --profile acc_bench
  //
  let perf_cmd = `docker run -it --rm --network=host `;
  
  //const model_dir = get_model_cache(env);
  const perf_container = 'dustynv/mlc:r36.4.0'; // env.container_image

  perf_cmd += `${exists(cache_dir) ? cache_dir : ''} `;
  perf_cmd += `${exists(hf_hub_dir) ? hf_hub_dir : ''} `;
  perf_cmd += `${exists(hf_token) ? hf_token : ''} `;
  perf_cmd += `-v /var/run/docker.sock:/var/run/docker.sock ${DEBUG} `;
  perf_cmd += `${perf_container} sudonim bench stop `;
  perf_cmd += `--host ${exists(server_url) ? server_url.hostname : '0.0.0.0'} `;
  perf_cmd += `--port ${exists(server_url) ? server_url.port : 9000} `;
  perf_cmd += `--model ${env.url} `;

  if( 'tokenizer' in env )
    perf_cmd += `--tokenizer ${env.tokenizer} `;

  var perf_compose = composerize(perf_cmd, null, 'latest', 2);

  for( let n=0; n < 3; n++ )
    perf_compose = perf_compose.substring(perf_compose.indexOf("\n") + 1);

  const perf_pre = `  perf_bench:\n    profiles:\n      - perf_bench\n` +
    `    depends_on:\n      llm_server:\n        condition: service_healthy\n`;

  //console.log('PERF CMD', perf_cmd);
  //console.log(`PERF_COMPOSE\n${perf_compose}\nPERF_PRE\n${perf_pre}`);

  let code = env.pages.docker_compose.code;

  code = code.replace('  mlc:', '  llm_server:');
  code = code.replace('  llama_cpp:', '  llm_server:');
  code = code.replace('  tensorrt_llm:', '  llm_server:');
  code = code.replace('  vllm:', '  llm_server:');

  env.pages.docker_compose.code = 
    code + '\n' + perf_pre + perf_compose;

  return env;
}

const TEST_PROMPT = "Why did the LLM cross the road?";
//const TEST_PROMPT = "You can put multiple chat turns in here.";
//const TEST_PROMPT = "Please tell me about your features as an LLM.";
//const TEST_PROMPT = "Write a limerick about the wonders of GPU computing.";

/*
 * python
 */
export function PythonGenerator({db, key, env}) {

  const max_tokens=exists(env.max_context_len) ? 
        `\n  max_tokens=${env.max_context_len},` : ``;

  const code = 
`# Run 'pip install openai' before running this.
# It can be run outside container, or from LAN.
client = OpenAI(
  base_url = 'http://${env.server_host}/v1',
  api_key = '*' # not enforced
)

chat = [{
  'role': 'user',
  'content': '${TEST_PROMPT}'
}]

completion = client.chat.completions.create(
  model=\'*\', # not enforced
  messages=chat,${GenerationConfig({db: db, key:key, env:env})}
  stream=True
)

for chunk in completion:
  if chunk.choices[0].delta.content is not None:
    print(chunk.choices[0].delta.content, end='')
`;

  env.pages.python = {
    name: 'python',
    lang: 'python',
    file: 'llm.py',
    code: code,
  };
  
  return env;
}


/*
 * javascript (node)
 */
export function JavascriptGenerator({db, key, env}) {

  const code = 
`import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'http://${env.server_host}/v1',
  apiKey: '*', // not enforced 
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: \'*\', // not enforced
    messages: [{
      'role': 'user',
      'content': "${TEST_PROMPT}"
    }],${GenerationConfig({db: db, key:key, env:env, indent: 4, assign: ':'})}
    stream: true,
  })
   
  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '')
  }
}

main();`;

  env.pages.javascript = {
    name: 'javascript',
    lang: 'javascript',
    file: 'llm.js',
    code: code
  };
  
  return env;
}


/*
 * curl (shell)
 */
export function CurlGenerator({db, key, env}) {

  const code = 
`curl http://${env.server_host}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer none" \\
  -d '{
    "model": "*",
    "messages": [{"role":"user","content":"${TEST_PROMPT}"}],${GenerationConfig({db: db, key:key, env:env, indent: 4, assign: ': ', quote: '\"'})}
    "stream": true                
  }'
`;

  env.pages.curl = {
    name: 'curl',
    lang: 'shell',
    code: code,
    header: '# This is a quick test that LLM server is working.\n# Run this in another terminal (can be tricky to read)'
  };

  return env;
}


/*
 * Generation parameters
 */
export function GenerationConfig({db, key, env, quote='', assign='=', indent=2}) {
  env.temperature ??= key.includes('deepseek') ? 0.6 : 0.2;
  env.top_p ??= key.includes('deepseek') ? 0.95 : 0.7;

  const params = {
    'temperature': 'temperature',
    'top_p': 'top_p',
    'max_context_len': 'max_tokens'
  }

  let txt = '';

  for( const param_key in params ) {
    if( !exists(env[param_key]) )
      continue
    txt += `\n${' '.repeat(indent)}${quote}${params[param_key]}${quote}${assign}${env[param_key]},`
  }

  return txt;
}


const _LANG_TO_EXT = {
  shell: '.sh',
  yaml: '.yml',
  python: '.py',
  javascript: '.js'
};


/*
 * export a zip file to download with everything
 */
export function ZipGenerator({db, keys}) {

  let zip = new JSZip();
  let folders = {};

  const families = db.children['llm'];
  
  for( const family_name of families )
    folders[family_name] = zip.folder(family_name);

  for( const key of keys ) {
    const env = ModelGenerator({db: db, key: key});

    if( !exists(env) )
      continue;

    const x = db.flat[key];

    function find_family() {
      for( const family_name of families ) {
        if( db.ancestors[key].includes(family_name) )
          return family_name;
      }
    }

    const group = find_family();
    const key_folder = exists(group) ? folders[group].folder(key) : zip.folder(key);

    for( const page_name in env.pages ) {
      const page = env.pages[page_name];
      const file = get_page_name(page);
      key_folder.file(file, page.code);
    }
  }

  const zip_name = keys.length > 1 ? 'jetson-ai-lab.zip' : `${keys[0]}.zip`;

  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, zip_name); // see FileSaver.js
  });
}


/*
 * Browser file downloader
 */
export function save_page({page}) {
  if( is_list(page) )
    return save_pages(page);
  var blob = new Blob([page.code], {type: "text/plain;charset=utf-8"});
  saveAs(blob, get_page_name(page));
}

function find_key(x) {
  for( const z in x ) {
    if( exists(x[z].key) )
      return x[z].key;
  }
}

export function save_pages(pages) {

  const key = find_key(pages);
  let zip = new JSZip();
  let folder = zip.folder(key);

  for( const page_key in pages ) {
    const page = pages[page_key];
    folder.file(get_page_name(page), page.code);
  }

  const zip_name = `${key}.zip`;
  zip.generateAsync({type:"blob"})
  .then(function(content) {
      saveAs(content, zip_name); 
  });
}


/*
 * Generate a filename for content if they don't already have one
 */
export function get_page_name(page) {
  let file = page.file;

  if( !exists(file) ) {
    file = `${page.name}${_LANG_TO_EXT[page.lang]}`;
  }

  return file;
}


/*
 * Parse model names from path (normally this should just use the model key)
 */
export function get_model_name(model) {
  if( !exists(model) )
    return null;

  //model = model.split('/');
  //return model[model.length-1];
  model = model.replace('hf.co/', '');

  if( model.toLowerCase().includes('.gguf') ) {
    const split = model.split('/');
    model = split[split.length-1];
  }

  return model;
}

export function get_model_repo(model) {
  return model.replace('hf.co/', '');
}

export function get_model_cache(env) {
  var model = env.url ?? env.model_name;
  const api = get_model_api(model);

  if( api == 'mlc' )
    var cache = 'mlc_llm';
  else if( api == 'llama.cpp' )
    var cache = 'llama_cpp';

  var repo = get_model_repo(model);
  var split = repo.split('/');

  if( split.length >= 3 && split[split.length-1].toLowerCase().includes('.gguf') )
    repo = split.slice(0, split.length-1).join('/');

  return `/root/.cache/${cache}/${repo}`;
}

export function get_model_api(model) {
  if( !is_string(model) )
    return null;
  model = model.toLowerCase();

  if( model.includes('mlc') )
    return 'mlc';
  else if( model.includes('.gguf') )
    return 'llama.cpp';
  else
    console.warn(`Unsupported / unrecognized model ${model}`);
}

/*
 * Validate missing entries from pages (for reverse links through the UI)
 */
function ValidatePages(args) {
  let pages = args.env.pages;
  //if( !is_list(pages) )
  //  pages = [pages];
  for( const page_key in pages ) {
    let page = pages[page_key];
    page.db ??= args.db;
    page.key ??= args.key;

    if( page.code.includes('undefined') )
      return null;
  }
  //pages.db ??= args.db;
  //pages.key ??= args.key;
  //args.env.pages = pages;
  return pages;
}