import env from '../../env';

/**
 * Encapsulate network requests to the API
 */
export default class Network {
  /**
   * Display that the network is loading data
   * @private
   */
  displayLoading() {
    $(".chart-control").prop('disabled', true);
    $(".row-error").hide();
    $(".row-loading").show();
  }

  /**
   * Display to the user that there was an error
   * @private
   */
  displayError() {
    $(".row-loading").hide();
    $(".row-error").show();
  }

  /**
   * Remove all alerts and error info
   * @private
   */
  removeAlerts() {
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
  sendRequest(request) {
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

  /**
   * Build a URL to the API v1
   * @param {string} path - The URL path within the API
   * @param {object} opts - Map of options for the query
   */
  buildUrl(path, opts) {
    const baseUrl = env.api_url || 'http://api.pma2020.org';
    const url =  `${baseUrl}/v1/${path}`;
    if (opts) {
      const params = Object
        .entries(opts)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
      return [url, params].join('?');
    }
    return url;
  }

  /**
   * Send a GET request to the API at path, with options (opts)
   * @param {string} path - The URL path within the API
   * @param {object} opts - Map of options for the query
   * @return {object} the json object from the API
   */
  getPath(path, opts) {
    const request = new Request(this.buildUrl(path, opts));
    return this.sendRequest(request);
  }
}
