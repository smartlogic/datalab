import env from '../../env';
import Utility from './utility';
import Promise from 'promise-polyfill';
import 'whatwg-fetch';

/**
 * Encapsulate network requests to the API
 */
export default class Network {
  /**
   * Display that the network is loading data
   * @private
   */
  static displayLoading() {
    $(".chart-control").prop('disabled', true);
    $(".row-error").hide();
    $(".row-loading").show();
  }

  /**
   * Display to the user that there was an error
   * @private
   */
  static displayError() {
    $(".row-loading").hide();
    $(".row-error").show();
  }

  /**
   * Remove all alerts and error info
   * @private
   */
  static removeAlerts() {
    $(".chart-control").prop('disabled', false);
    $(".row-loading").hide();
    $(".row-error").hide();
  }

  /**
   * Send network request for data
   * @param {Request} request - Standard request object for `fetch`
   * @return {object} the JSON response as an object
   * @private
   */
  static sendRequest(request) {
    this.displayLoading();
    return fetch(request).then((response) => {
      this.removeAlerts();
      return response.json();
    }).catch(function(err) {
      this.displayError();
      console.log("Error while attempting to request resource. Please contact site administrator.");
      console.log(err);
    });
  }

  static sendIERequest(url) {
    this.displayLoading();
    const self = this;
    return fetch(url).then(function(response) {
      self.removeAlerts();
      return response.json();
    }).catch(function(err) {
      self.displayError();
      console.log("Error while attempting to request resource. Please contact site administrator.");
      console.log(err);
    });
    /*
    $.ajax({
      url: url,
      success: function(response) {
        self.removeAlerts();
        return JSON.stringify(response);
      },
      error: function(err) {
        self.displayError();
        console.log("Error while attempting to request resource. Please contact site administrator.");
        console.log(err);
      }
    });*/
  }

  /**
   * Build a URL to the API v1
   * @param {string} path - The URL path within the API
   * @param {object} opts - Map of options for the query
   */
  static buildUrl(path, opts) {
    const baseUrl = env.api_url || 'http://api.pma2020.org';
    let url = `${baseUrl}/v1/${path}`;
    if (opts) {
      url = `${url}?`;
      for (let k in opts) {
        if (opts[k]) {
          url = `${url}${k}=${opts[k]}&`;
        }
      }
    }
    return url;
  }

  /**
   * Send a GET request to the API at path, with options (opts)
   * @param {string} path - The URL path within the API
   * @param {object} opts - Map of options for the query
   * @return {object} the json object from the API
   */
  static get(path, opts) {
    if (Utility.isIE()) {
      return this.sendIERequest(this.buildUrl(path, opts));
    } else {
      const request = new Request(this.buildUrl(path, opts));
      return this.sendRequest(request); 
    }
  }
  
  /*
  static buildExternalUrl(path, opts) {
    let url = `${path}`;
    if (opts) {
      url = `${url}?`;
      for (let k in opts) {
        if (opts[k]) {
          url = `${url}${k}=${opts[k]}&`;
        }
      }
    }
    return url;
  }

  static getFromExternalUrl(path, opts) {
    if (Utility.isIE()) {
      return this.sendIERequest(this.buildExternalUrl(path, opts));
    } else {
      const request = new Request(this.buildExternalUrl(path, opts));
      return this.sendRequest(request); 
    }
  }*/
}
