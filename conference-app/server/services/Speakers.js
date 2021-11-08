const axios = require('axios');
const url = require('url');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const CircuitBreaker = require('../lib/CircuitBreaker');

const fsExists = util.promisify(fs.exists);

const circuitBreaker = new CircuitBreaker();

class SpeakersService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getImage(path) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      responseType: 'stream',
      url: `http://${ip}:${port}/images/${path}`,
    });
  }

  async getNames() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`,
    });
  }

  async getListShort() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`,
    });
  }

  async getList() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    });
  }

  async getAllArtwork() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`,
    });
  }

  async getSpeaker(shortName) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortName}`,
    });
  }

  async getArtworkForSpeaker(shortName) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortName}`,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  async callService(requestOptions) {
    const servicePath = url.parse(requestOptions.url).path;
    const cacheKey = crypto
      .createHash('md5')
      .update(requestOptions.method + servicePath)
      .digest('hex');
    let cacheFile = null;

    if (requestOptions.responseType && requestOptions.responseType === 'stream') {
      cacheFile = `${__dirname}/../../_image_cache/${cacheKey}`;
    }
    const result = await circuitBreaker.callService(requestOptions);

    if (!result) {
      if (this.cache[cacheKey]) return this.cache[cacheKey];
      if (cacheFile) {
        const exists = await fsExists(cacheFile);
        if (exists) return fs.createReadStream(cacheFile);
      }
      return false;
    }

    if (!cacheFile) {
      this.cache[cacheKey] = result;
    } else {
      const ws = fs.createWriteStream(cacheFile);
      result.pipe(ws);
    }
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  async getService(serviceName) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${serviceName}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

module.exports = SpeakersService;
