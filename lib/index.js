'use strict';

const {request} = require('http');

const options = {
  host: '',
  user: '',
  pass: '',
  tags: [],
  time: 0,
  timeout: 1000,
  all: false
};

for (let i = 0; i < process.argv.length; ++i)
{
  const k = process.argv[i].substring(2);

  switch (k)
  {
    case 'host':
    case 'user':
    case 'pass':
      options[k] = process.argv[++i];
      break;

    case 'tags':
      options.tags = (process.argv[++i] || '').split(',').filter(v => v.length > 0);
      break;

    case 'time':
    case 'timeout':
      options[k] = parseInt(process.argv[++i], 10) || 0;
      break;

    case 'all':
      options.all = true;
      break;
  }
}

if (!options.host)
{
  log({
    type: 'error',
    code: 'INVALID_ARGUMENT',
    message: 'The --host argument is required.'
  });
  process.exit(1);
}

if (options.time > 0)
{
  setTimeout(() => process.exit(0), options.time);
}

const TAGS = {};
const NUMBER_RE = /^-?[0-9]+(\.[0-9]+)?$/;
const REQUEST = {
  hostname: options.host,
  port: 80,
  path: '/xml/ix.xml',
  method: 'GET',
  headers: {
    Connection: 'keep-alive'
  },
  timeout: 5000
};

if (options.user)
{
  REQUEST.headers.Authorization = `Basic ${Buffer.from(`${options.user}:${options.pass}`).toString('base64')}`;
}

read();

function log(message)
{
  console.log(JSON.stringify(message));
}

function read()
{
  const req = request(REQUEST);
  const timer = setTimeout(() => req.abort(), options.timeout);

  req.on('error', err =>
  {
    log({
      type: 'error',
      code: err.code,
      message: err.message
    });
  });

  req.on('response', res =>
  {
    clearTimeout(timer);

    if (res.statusCode !== 200)
    {
      return log({
        type: 'error',
        code: 'INVALID_RESPONSE'
      });
    }

    let body = '';

    res.on('readable', () =>
    {
      const data = res.read();

      if (data)
      {
        body += data;
      }
    });

    res.on('error', () => {});

    res.on('end', () =>
    {
      const re = /<(.*?)>(.*?)<\/.*?>\n/g;
      const tags = {};
      let ind = 0;
      let changes = 0;
      let match;

      while ((match = re.exec(body)) !== null) // eslint-disable-line no-cond-assign
      {
        const k = match[1];
        const v = NUMBER_RE.test(match[2]) ? +match[2] : match[2];

        if (k === 'ind')
        {
          ind = v;
        }

        if ((options.tags.length === 0 || options.tags.includes(k)) && v !== TAGS[k])
        {
          TAGS[k] = tags[k] = v;
          changes += 1;
        }
      }

      for (let i = 0; i < 4; ++i)
      {
        const k = `ind${i + 1}`;
        const v = ind & Math.pow(2, i);

        if ((!options.tags.length || options.tags.includes(`ind${i + 1}`)) && v !== TAGS[k])
        {
          TAGS[k] = tags[k] = v;
          changes += 1;
        }
      }

      if (changes > 0)
      {
        log({
          type: 'tags',
          tags: options.all ? TAGS : tags
        });
      }
    });
  });

  req.on('close', () =>
  {
    setImmediate(read);
  });

  req.end();
}
