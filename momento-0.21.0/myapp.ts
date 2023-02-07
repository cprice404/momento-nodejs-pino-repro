import {
  CacheGet,
  CacheSet,
  Configurations,
  CreateCache,
  EnvMomentoTokenProvider,
  SimpleCacheClient
} from "@gomomento/sdk";
let client: any = null;

export const getMomentoClient = async () => {
  if (client) return client;

  const {
    token,
    ttl,
    configuration,
  } = await momento_config();

  client = new SimpleCacheClient({
    configuration: configuration,
    credentialProvider: token,
    defaultTtlSeconds: ttl
  });

  return client;
}

const getMomentoToken = async (region: string) => {
  return new EnvMomentoTokenProvider({environmentVariableName: 'MOMENTO_TOKEN'})
}

export const momento_config = async () => {
  const configuration = Configurations.Laptop.latest();

  const default_ttl = 60;

  const token = await getMomentoToken(process.env.AWS_REGION as string);

  return {
    token: token,
    ttl: default_ttl,
    configuration: configuration
  }
}

async function main() {
  const momento = await getMomentoClient();
  const cacheName = 'cache';
  const createCacheResponse = await momento.createCache(cacheName);
  if (createCacheResponse instanceof CreateCache.AlreadyExists) {
    console.log('cache already exists');
  } else if (createCacheResponse instanceof CreateCache.Error) {
    throw createCacheResponse.innerException();
  }

  const setResponse = await momento.set(cacheName, 'key', 'value');
  if (setResponse instanceof CacheSet.Success) {
    console.log('Key stored successfully!');
  } else if (setResponse instanceof CacheSet.Error) {
    console.log(`Error setting key: ${setResponse.message()}`);
  }

  const getResponse = await momento.get(cacheName, 'key');
  if (getResponse instanceof CacheGet.Hit) {
    console.log(`cache hit: ${String(getResponse.valueString())}`);
  } else if (getResponse instanceof CacheGet.Miss) {
    console.log('cache miss');
  } else if (getResponse instanceof CacheGet.Error) {
    console.log(`Error: ${getResponse.message()}`);
  }
}

main().catch(e => {
  console.error(`An error occurred!  ${e}`);
  throw e;
})
