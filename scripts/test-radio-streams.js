import https from 'https';
import http from 'http';

// Radio stream connectivity test - validates stream testing functionality
// Tests both working and non-working streams to ensure proper error handling
const testStreams = [
  {
    name: 'NPR News (reliable stream)',
    url: 'https://npr-ice.streamguys1.com/live.mp3',
  },
  {
    name: 'KEXP (reliable stream)',
    url: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
  },
  {
    name: 'SomaFM Groove Salad (reliable stream)',
    url: 'https://ice2.somafm.com/groovesalad-128-mp3',
  },
  {
    name: 'Radio Biobío (Chile - test 404 handling)',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOBIOBIO.mp3',
  },
  {
    name: 'Radio Cooperativa (Chile - test 404 handling)',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/COOPERATIVA.mp3',
  },
  {
    name: 'Radio Concierto (Chile - test 404 handling)',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOCONCIERTO.mp3',
  },
  {
    name: 'Radio Universidad Chile (Chile - test 403 handling)',
    url: 'https://radio.uchile.cl/radio_uchile.mp3',
  },
  {
    name: 'Radio ADN (Chile - test redirect handling)',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/ADN.mp3',
  },
  {
    name: 'Invalid URL (test DNS error handling)',
    url: 'https://nonexistent-domain-that-should-fail.com/stream.mp3',
  },
  {
    name: 'HTTP Stream (test protocol handling)',
    url: 'http://ice2.somafm.com/groovesalad-128-mp3',
  },
];

function testStream(url, name) {
  return new Promise(resolve => {
    const client = url.startsWith('https:') ? https : http;

    const req = client.request(url, { method: 'HEAD', timeout: 10000 }, res => {
      console.log(`✅ ${name}: ${res.statusCode} ${res.statusMessage}`);
      console.log(
        `   Content-Type: ${res.headers['content-type'] || 'unknown'}`
      );
      console.log(
        `   CORS: ${res.headers['access-control-allow-origin'] || 'not set'}`
      );
      console.log(
        `   Cache-Control: ${res.headers['cache-control'] || 'not set'}`
      );
      console.log('');

      resolve({
        name,
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        cors: res.headers['access-control-allow-origin'],
        working: res.statusCode === 200,
      });
    });

    req.on('error', err => {
      console.log(`❌ ${name}: ${err.message}`);
      console.log('');

      resolve({
        name,
        url,
        error: err.message,
        working: false,
      });
    });

    req.on('timeout', () => {
      console.log(`⏰ ${name}: Timeout`);
      console.log('');
      req.destroy();
      resolve({
        name,
        url,
        error: 'timeout',
        working: false,
      });
    });

    req.end();
  });
}

async function testAllStreams() {
  console.log('🔍 Testing radio stream URLs...\n');

  const results = [];
  for (const stream of testStreams) {
    const result = await testStream(stream.url, stream.name);
    results.push(result);
  }

  console.log('📊 Summary:');
  const working = results.filter(r => r.working);
  const failed = results.filter(r => !r.working);

  console.log(`✅ Working streams: ${working.length}`);
  console.log(`❌ Failed streams: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\n🔧 Failed streams:');
    failed.forEach(f =>
      console.log(`   - ${f.name}: ${f.error || 'HTTP ' + f.status}`)
    );
  }

  return results;
}

testAllStreams()
  .then(() => {
    console.log('\n🎯 Radio stream testing completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
