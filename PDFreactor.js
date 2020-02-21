/*
 * RealObjects PDFreactor Node.js Wrapper version 6
 * https://www.pdfreactor.com
 * 
 * Released under the following license:
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015-2019 RealObjects GmbH
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const url = require('url');
const stream = require('stream');
class PDFreactor {
constructor(serviceUrl) {
    this._serviceUrl = serviceUrl || 'http://localhost:9423/service/rest';
    if (this._serviceUrl.substr(-1) === '/') {
        this._serviceUrl = this._serviceUrl.substr(0, this._serviceUrl.length - 1);
    }
    if (url.parse(this._serviceUrl).protocol === 'https:') {
        this._http = require('https');
    } else {
        this._http = require('http');
    }
}
convert(configuration, connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/convert.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        if (configuration) {
            configuration.clientName = "NODEJS";
            configuration.clientVersion = PDFreactor.VERSION;
        }
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'post';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve(this._parseJson(responseText));
                } else {
                    let e;
                    if (res.statusCode == 422) {
                        e = this._parseJson(responseText).error;
                    } else if (res.statusCode == 400) {
                        e = "Invalid client data. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 413) {
                        e = "The configuration is too large to process.";
                    } else if (res.statusCode == 500) {
                        e = this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.write(JSON.stringify(configuration));
        req.end();
    });
};
convertAsBinary(configuration, writeStream, connectionSettings) {
    if (!(writeStream instanceof stream && typeof writeStream.write == 'function')) {
        connectionSettings = writeStream;
        writeStream = undefined;
    }
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/convert.bin';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        if (configuration) {
            configuration.clientName = "NODEJS";
            configuration.clientVersion = PDFreactor.VERSION;
        }
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'post';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('binary');
            if (writeStream) {
                res.pipe(writeStream);
            }
            res.once('data', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
            });
            res.on('data', (chunk) => {
                if (errorMode || !writeStream) {
                    responseText += chunk;
                }
            });
            res.on('end', () => {
                if (writeStream) {
                    writeStream.end();
                    return resolve();
                }
                if (!errorMode) {
                    return resolve(responseText);
                } else {
                    let e;
                    if (res.statusCode == 422) {
                        e = responseText;
                    } else if (res.statusCode == 400) {
                        e = "Invalid client data. " + responseText;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + responseText;
                    } else if (res.statusCode == 413) {
                        e = "The configuration is too large to process.";
                    } else if (res.statusCode == 500) {
                        e = responseText;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.write(JSON.stringify(configuration));
        req.end();
    });
};
convertAsync(configuration, connectionSettings) {
    return new Promise((resolve, reject) => {
        let documentId;
        let restUrl = this._serviceUrl + '/convert/async.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        if (configuration) {
            configuration.clientName = "NODEJS";
            configuration.clientVersion = PDFreactor.VERSION;
        }
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'post';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                let progressUrl = res.headers["location"];
                if (progressUrl) {
                    documentId = progressUrl.substring(progressUrl.lastIndexOf("/") + 1);
                    let cookieHeader = res.headers['set-cookie'];
                    if (cookieHeader && connectionSettings) {
                        if (!connectionSettings.cookies) {
                            connectionSettings.cookies = {};
                        }
                        cookieHeader.forEach((item) => {
                            let name = item.substring(0, item.indexOf('='));
                            let value = item.substring(item.indexOf('=') + 1, item.indexOf(';'));
                            connectionSettings.cookies[name] = value;
                        });
                    }
                }
                if (!errorMode) {
                    return resolve(documentId);
                } else {
                    let e;
                    if (res.statusCode == 422) {
                        e = this._parseJson(responseText).error;
                    } else if (res.statusCode == 400) {
                        e = "Invalid client data. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 413) {
                        e = "The configuration is too large to process.";
                    } else if (res.statusCode == 500) {
                        e = this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "Asynchronous conversions are unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.write(JSON.stringify(configuration));
        req.end();
    });
}
getProgress(documentId, connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/progress/' + documentId + '.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve(this._parseJson(responseText));
                } else {
                    let e;
                    if (res.statusCode == 404) {
                        e = "Document with the given ID was not found. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getDocument(documentId, connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/document/' + documentId + '.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve(this._parseJson(responseText));
                } else {
                    let e;
                    if (res.statusCode == 404) {
                        e = "Document with the given ID was not found. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getDocumentAsBinary(documentId, writeStream, connectionSettings) {
    if (!(writeStream instanceof stream && typeof writeStream.write == 'function')) {
        connectionSettings = writeStream;
        writeStream = undefined;
    }
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/document/' + documentId + '.bin';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('binary');
            if (writeStream) {
                res.pipe(writeStream);
            }
            res.once('data', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
            });
            res.on('data', (chunk) => {
                if (errorMode || !writeStream) {
                    responseText += chunk;
                }
            });
            res.on('end', () => {
                if (writeStream) {
                    writeStream.end();
                    return resolve();
                }
                if (!errorMode) {
                    return resolve(responseText);
                } else {
                    let e;
                    if (res.statusCode == 404) {
                        e = "Document with the given ID was not found. " + responseText;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + responseText;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getDocumentMetadata(documentId, connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/document/metadata/' + documentId + '.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve(this._parseJson(responseText));
                } else {
                    let e;
                    if (res.statusCode == 404) {
                        e = "Document with the given ID was not found. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
deleteDocument(documentId, connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/document/' + documentId + '.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'delete';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve();
                } else {
                    let e;
                    if (res.statusCode == 404) {
                        e = "Document with the given ID was not found. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getStatus(connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/status.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve();
                } else {
                    let e;
                    if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getVersion(connectionSettings) {
    return new Promise((resolve, reject) => {
        let restUrl = this._serviceUrl + '/version.json';
        if (this.apiKey) {
            restUrl += '?apiKey=' + this.apiKey;
        }
        let options = url.parse(restUrl);
        options.headers = {};
        if (connectionSettings && connectionSettings.headers) {
            for (let key in connectionSettings.headers) {
                let lcKey = key.toLowerCase();
                if (lcKey !== "user-agent" && lcKey !== "content-type" && lcKey !== "range") {
                    options.headers[key] = connectionSettings.headers[key];
                }
            }
        }
        options.headers.cookie = '';
        options.headers['Content-Type'] = 'application/json';
        options.headers['User-Agent'] = 'PDFreactor Node.js API v6';
        options.headers['X-RO-User-Agent'] = 'PDFreactor Node.js API v6';
        options.method = 'get';
        if (connectionSettings && connectionSettings.cookies) {
            for (let name in connectionSettings.cookies) {
                if (connectionSettings.cookies.hasOwnProperty(name)) {
                    options.headers.cookie += name + '=' + connectionSettings.cookies[name] + ', ';
                }
            }
        }
        let errorMode = true;
        let responseText = '';
        let req = this._http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                responseText += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 204) {
                    errorMode = false;
                }
                if (!errorMode) {
                    return resolve(this._parseJson(responseText));
                } else {
                    let e;
                    if (res.statusCode == 401) {
                        e = "Unauthorized. " + this._parseJson(responseText).error;
                    } else if (res.statusCode == 503) {
                        e = "PDFreactor Web Service is unavailable.";
                    } else {
                        e = "PDFreactor Web Service error (status: " + res.statusCode + ").";
                    }
                    return reject(e);
                }
            });
        });
        req.on('error', (e) => {
            return reject('Error connecting to PDFreactor Web Service at ' + this._serviceUrl + '. Please make sure the PDFreactor Web Service is installed and running (' + e + ')');
        });
        req.end();
    });
}
getDocumentUrl(documentId) {
    if (documentId) {
        return this._serviceUrl + "/document/" + documentId;
    }
}
getProgressUrl(documentId) {
    if (documentId) {
        return this._serviceUrl + "/progress/" + documentId;
    }
}
get apiKey() {
    return this._apiKey;
}
set apiKey(value) {
    this._apiKey = value;
}
_parseJson(string) {
    try {
        return JSON.parse(string);
    } catch (e) {
        return { error: '' };
    }
}
}
Object.defineProperty(PDFreactor, 'CallbackType', {
    value: {}
});
Object.defineProperty(PDFreactor.CallbackType, 'FINISH', {
    value: 'FINISH'
});
Object.defineProperty(PDFreactor.CallbackType, 'PROGRESS', {
    value: 'PROGRESS'
});
Object.defineProperty(PDFreactor.CallbackType, 'START', {
    value: 'START'
});
Object.defineProperty(PDFreactor, 'Cleanup', {
    value: {}
});
Object.defineProperty(PDFreactor.Cleanup, 'CYBERNEKO', {
    value: 'CYBERNEKO'
});
Object.defineProperty(PDFreactor.Cleanup, 'JTIDY', {
    value: 'JTIDY'
});
Object.defineProperty(PDFreactor.Cleanup, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.Cleanup, 'TAGSOUP', {
    value: 'TAGSOUP'
});
Object.defineProperty(PDFreactor, 'ColorSpace', {
    value: {}
});
Object.defineProperty(PDFreactor.ColorSpace, 'CMYK', {
    value: 'CMYK'
});
Object.defineProperty(PDFreactor.ColorSpace, 'RGB', {
    value: 'RGB'
});
Object.defineProperty(PDFreactor, 'Conformance', {
    value: {}
});
Object.defineProperty(PDFreactor.Conformance, 'PDF', {
    value: 'PDF'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA1A', {
    value: 'PDFA1A'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA1A_PDFUA1', {
    value: 'PDFA1A_PDFUA1'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA1B', {
    value: 'PDFA1B'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA2A', {
    value: 'PDFA2A'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA2A_PDFUA1', {
    value: 'PDFA2A_PDFUA1'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA2B', {
    value: 'PDFA2B'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA2U', {
    value: 'PDFA2U'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA3A', {
    value: 'PDFA3A'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA3A_PDFUA1', {
    value: 'PDFA3A_PDFUA1'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA3B', {
    value: 'PDFA3B'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFA3U', {
    value: 'PDFA3U'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFUA1', {
    value: 'PDFUA1'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX1A_2001', {
    value: 'PDFX1A_2001'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX1A_2003', {
    value: 'PDFX1A_2003'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX3_2002', {
    value: 'PDFX3_2002'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX3_2003', {
    value: 'PDFX3_2003'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX4', {
    value: 'PDFX4'
});
Object.defineProperty(PDFreactor.Conformance, 'PDFX4P', {
    value: 'PDFX4P'
});
Object.defineProperty(PDFreactor, 'ContentType', {
    value: {}
});
Object.defineProperty(PDFreactor.ContentType, 'BINARY', {
    value: 'BINARY'
});
Object.defineProperty(PDFreactor.ContentType, 'BMP', {
    value: 'BMP'
});
Object.defineProperty(PDFreactor.ContentType, 'GIF', {
    value: 'GIF'
});
Object.defineProperty(PDFreactor.ContentType, 'HTML', {
    value: 'HTML'
});
Object.defineProperty(PDFreactor.ContentType, 'JPEG', {
    value: 'JPEG'
});
Object.defineProperty(PDFreactor.ContentType, 'JSON', {
    value: 'JSON'
});
Object.defineProperty(PDFreactor.ContentType, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.ContentType, 'PDF', {
    value: 'PDF'
});
Object.defineProperty(PDFreactor.ContentType, 'PNG', {
    value: 'PNG'
});
Object.defineProperty(PDFreactor.ContentType, 'TEXT', {
    value: 'TEXT'
});
Object.defineProperty(PDFreactor.ContentType, 'TIFF', {
    value: 'TIFF'
});
Object.defineProperty(PDFreactor.ContentType, 'XML', {
    value: 'XML'
});
Object.defineProperty(PDFreactor, 'CssPropertySupport', {
    value: {}
});
Object.defineProperty(PDFreactor.CssPropertySupport, 'ALL', {
    value: 'ALL'
});
Object.defineProperty(PDFreactor.CssPropertySupport, 'HTML', {
    value: 'HTML'
});
Object.defineProperty(PDFreactor.CssPropertySupport, 'HTML_THIRD_PARTY', {
    value: 'HTML_THIRD_PARTY'
});
Object.defineProperty(PDFreactor.CssPropertySupport, 'HTML_THIRD_PARTY_LENIENT', {
    value: 'HTML_THIRD_PARTY_LENIENT'
});
Object.defineProperty(PDFreactor, 'Doctype', {
    value: {}
});
Object.defineProperty(PDFreactor.Doctype, 'AUTODETECT', {
    value: 'AUTODETECT'
});
Object.defineProperty(PDFreactor.Doctype, 'HTML5', {
    value: 'HTML5'
});
Object.defineProperty(PDFreactor.Doctype, 'XHTML', {
    value: 'XHTML'
});
Object.defineProperty(PDFreactor.Doctype, 'XML', {
    value: 'XML'
});
Object.defineProperty(PDFreactor, 'Encryption', {
    value: {}
});
Object.defineProperty(PDFreactor.Encryption, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.Encryption, 'TYPE_128', {
    value: 'TYPE_128'
});
Object.defineProperty(PDFreactor.Encryption, 'TYPE_40', {
    value: 'TYPE_40'
});
Object.defineProperty(PDFreactor, 'ErrorPolicy', {
    value: {}
});
Object.defineProperty(PDFreactor.ErrorPolicy, 'LICENSE', {
    value: 'LICENSE'
});
Object.defineProperty(PDFreactor.ErrorPolicy, 'MISSING_RESOURCE', {
    value: 'MISSING_RESOURCE'
});
Object.defineProperty(PDFreactor, 'ExceedingContentAgainst', {
    value: {}
});
Object.defineProperty(PDFreactor.ExceedingContentAgainst, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.ExceedingContentAgainst, 'PAGE_BORDERS', {
    value: 'PAGE_BORDERS'
});
Object.defineProperty(PDFreactor.ExceedingContentAgainst, 'PAGE_CONTENT', {
    value: 'PAGE_CONTENT'
});
Object.defineProperty(PDFreactor.ExceedingContentAgainst, 'PARENT', {
    value: 'PARENT'
});
Object.defineProperty(PDFreactor, 'ExceedingContentAnalyze', {
    value: {}
});
Object.defineProperty(PDFreactor.ExceedingContentAnalyze, 'CONTENT', {
    value: 'CONTENT'
});
Object.defineProperty(PDFreactor.ExceedingContentAnalyze, 'CONTENT_AND_BOXES', {
    value: 'CONTENT_AND_BOXES'
});
Object.defineProperty(PDFreactor.ExceedingContentAnalyze, 'CONTENT_AND_STATIC_BOXES', {
    value: 'CONTENT_AND_STATIC_BOXES'
});
Object.defineProperty(PDFreactor.ExceedingContentAnalyze, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor, 'HttpsMode', {
    value: {}
});
Object.defineProperty(PDFreactor.HttpsMode, 'LENIENT', {
    value: 'LENIENT'
});
Object.defineProperty(PDFreactor.HttpsMode, 'STRICT', {
    value: 'STRICT'
});
Object.defineProperty(PDFreactor, 'JavaScriptDebugMode', {
    value: {}
});
Object.defineProperty(PDFreactor.JavaScriptDebugMode, 'EXCEPTIONS', {
    value: 'EXCEPTIONS'
});
Object.defineProperty(PDFreactor.JavaScriptDebugMode, 'FUNCTIONS', {
    value: 'FUNCTIONS'
});
Object.defineProperty(PDFreactor.JavaScriptDebugMode, 'LINES', {
    value: 'LINES'
});
Object.defineProperty(PDFreactor.JavaScriptDebugMode, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.JavaScriptDebugMode, 'POSITIONS', {
    value: 'POSITIONS'
});
Object.defineProperty(PDFreactor, 'JavaScriptMode', {
    value: {}
});
Object.defineProperty(PDFreactor.JavaScriptMode, 'DISABLED', {
    value: 'DISABLED'
});
Object.defineProperty(PDFreactor.JavaScriptMode, 'ENABLED', {
    value: 'ENABLED'
});
Object.defineProperty(PDFreactor.JavaScriptMode, 'ENABLED_NO_LAYOUT', {
    value: 'ENABLED_NO_LAYOUT'
});
Object.defineProperty(PDFreactor.JavaScriptMode, 'ENABLED_REAL_TIME', {
    value: 'ENABLED_REAL_TIME'
});
Object.defineProperty(PDFreactor.JavaScriptMode, 'ENABLED_TIME_LAPSE', {
    value: 'ENABLED_TIME_LAPSE'
});
Object.defineProperty(PDFreactor, 'KeystoreType', {
    value: {}
});
Object.defineProperty(PDFreactor.KeystoreType, 'JKS', {
    value: 'JKS'
});
Object.defineProperty(PDFreactor.KeystoreType, 'PKCS12', {
    value: 'PKCS12'
});
Object.defineProperty(PDFreactor, 'LogLevel', {
    value: {}
});
Object.defineProperty(PDFreactor.LogLevel, 'DEBUG', {
    value: 'DEBUG'
});
Object.defineProperty(PDFreactor.LogLevel, 'FATAL', {
    value: 'FATAL'
});
Object.defineProperty(PDFreactor.LogLevel, 'INFO', {
    value: 'INFO'
});
Object.defineProperty(PDFreactor.LogLevel, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.LogLevel, 'PERFORMANCE', {
    value: 'PERFORMANCE'
});
Object.defineProperty(PDFreactor.LogLevel, 'WARN', {
    value: 'WARN'
});
Object.defineProperty(PDFreactor, 'MediaFeature', {
    value: {}
});
Object.defineProperty(PDFreactor.MediaFeature, 'ASPECT_RATIO', {
    value: 'ASPECT_RATIO'
});
Object.defineProperty(PDFreactor.MediaFeature, 'COLOR', {
    value: 'COLOR'
});
Object.defineProperty(PDFreactor.MediaFeature, 'COLOR_INDEX', {
    value: 'COLOR_INDEX'
});
Object.defineProperty(PDFreactor.MediaFeature, 'DEVICE_ASPECT_RATIO', {
    value: 'DEVICE_ASPECT_RATIO'
});
Object.defineProperty(PDFreactor.MediaFeature, 'DEVICE_HEIGHT', {
    value: 'DEVICE_HEIGHT'
});
Object.defineProperty(PDFreactor.MediaFeature, 'DEVICE_WIDTH', {
    value: 'DEVICE_WIDTH'
});
Object.defineProperty(PDFreactor.MediaFeature, 'GRID', {
    value: 'GRID'
});
Object.defineProperty(PDFreactor.MediaFeature, 'HEIGHT', {
    value: 'HEIGHT'
});
Object.defineProperty(PDFreactor.MediaFeature, 'MONOCHROME', {
    value: 'MONOCHROME'
});
Object.defineProperty(PDFreactor.MediaFeature, 'ORIENTATION', {
    value: 'ORIENTATION'
});
Object.defineProperty(PDFreactor.MediaFeature, 'RESOLUTION', {
    value: 'RESOLUTION'
});
Object.defineProperty(PDFreactor.MediaFeature, 'WIDTH', {
    value: 'WIDTH'
});
Object.defineProperty(PDFreactor, 'MergeMode', {
    value: {}
});
Object.defineProperty(PDFreactor.MergeMode, 'APPEND', {
    value: 'APPEND'
});
Object.defineProperty(PDFreactor.MergeMode, 'ARRANGE', {
    value: 'ARRANGE'
});
Object.defineProperty(PDFreactor.MergeMode, 'OVERLAY', {
    value: 'OVERLAY'
});
Object.defineProperty(PDFreactor.MergeMode, 'OVERLAY_BELOW', {
    value: 'OVERLAY_BELOW'
});
Object.defineProperty(PDFreactor.MergeMode, 'PREPEND', {
    value: 'PREPEND'
});
Object.defineProperty(PDFreactor, 'OutputIntentDefaultProfile', {
    value: {}
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'FOGRA39', {
    value: 'Coated FOGRA39'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'GRACOL', {
    value: 'Coated GRACoL 2006'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'IFRA', {
    value: 'ISO News print 26% (IFRA)'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'JAPAN', {
    value: 'Japan Color 2001 Coated'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'JAPAN_NEWSPAPER', {
    value: 'Japan Color 2001 Newspaper'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'JAPAN_UNCOATED', {
    value: 'Japan Color 2001 Uncoated'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'JAPAN_WEB', {
    value: 'Japan Web Coated (Ad)'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'SWOP', {
    value: 'US Web Coated (SWOP) v2'
});
Object.defineProperty(PDFreactor.OutputIntentDefaultProfile, 'SWOP_3', {
    value: 'Web Coated SWOP 2006 Grade 3 Paper'
});
Object.defineProperty(PDFreactor, 'OutputType', {
    value: {}
});
Object.defineProperty(PDFreactor.OutputType, 'BMP', {
    value: 'BMP'
});
Object.defineProperty(PDFreactor.OutputType, 'GIF', {
    value: 'GIF'
});
Object.defineProperty(PDFreactor.OutputType, 'JPEG', {
    value: 'JPEG'
});
Object.defineProperty(PDFreactor.OutputType, 'PDF', {
    value: 'PDF'
});
Object.defineProperty(PDFreactor.OutputType, 'PNG', {
    value: 'PNG'
});
Object.defineProperty(PDFreactor.OutputType, 'PNG_AI', {
    value: 'PNG_AI'
});
Object.defineProperty(PDFreactor.OutputType, 'PNG_TRANSPARENT', {
    value: 'PNG_TRANSPARENT'
});
Object.defineProperty(PDFreactor.OutputType, 'PNG_TRANSPARENT_AI', {
    value: 'PNG_TRANSPARENT_AI'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_CCITT_1D', {
    value: 'TIFF_CCITT_1D'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_CCITT_GROUP_3', {
    value: 'TIFF_CCITT_GROUP_3'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_CCITT_GROUP_4', {
    value: 'TIFF_CCITT_GROUP_4'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_LZW', {
    value: 'TIFF_LZW'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_PACKBITS', {
    value: 'TIFF_PACKBITS'
});
Object.defineProperty(PDFreactor.OutputType, 'TIFF_UNCOMPRESSED', {
    value: 'TIFF_UNCOMPRESSED'
});
Object.defineProperty(PDFreactor, 'OverlayRepeat', {
    value: {}
});
Object.defineProperty(PDFreactor.OverlayRepeat, 'ALL_PAGES', {
    value: 'ALL_PAGES'
});
Object.defineProperty(PDFreactor.OverlayRepeat, 'LAST_PAGE', {
    value: 'LAST_PAGE'
});
Object.defineProperty(PDFreactor.OverlayRepeat, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor.OverlayRepeat, 'TRIM', {
    value: 'TRIM'
});
Object.defineProperty(PDFreactor, 'PageOrder', {
    value: {}
});
Object.defineProperty(PDFreactor.PageOrder, 'BOOKLET', {
    value: 'BOOKLET'
});
Object.defineProperty(PDFreactor.PageOrder, 'BOOKLET_RTL', {
    value: 'BOOKLET_RTL'
});
Object.defineProperty(PDFreactor.PageOrder, 'EVEN', {
    value: 'EVEN'
});
Object.defineProperty(PDFreactor.PageOrder, 'ODD', {
    value: 'ODD'
});
Object.defineProperty(PDFreactor.PageOrder, 'REVERSE', {
    value: 'REVERSE'
});
Object.defineProperty(PDFreactor, 'PagesPerSheetDirection', {
    value: {}
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'DOWN_LEFT', {
    value: 'DOWN_LEFT'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'DOWN_RIGHT', {
    value: 'DOWN_RIGHT'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'LEFT_DOWN', {
    value: 'LEFT_DOWN'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'LEFT_UP', {
    value: 'LEFT_UP'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'RIGHT_DOWN', {
    value: 'RIGHT_DOWN'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'RIGHT_UP', {
    value: 'RIGHT_UP'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'UP_LEFT', {
    value: 'UP_LEFT'
});
Object.defineProperty(PDFreactor.PagesPerSheetDirection, 'UP_RIGHT', {
    value: 'UP_RIGHT'
});
Object.defineProperty(PDFreactor, 'PdfScriptTriggerEvent', {
    value: {}
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'AFTER_PRINT', {
    value: 'AFTER_PRINT'
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'AFTER_SAVE', {
    value: 'AFTER_SAVE'
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'BEFORE_PRINT', {
    value: 'BEFORE_PRINT'
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'BEFORE_SAVE', {
    value: 'BEFORE_SAVE'
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'CLOSE', {
    value: 'CLOSE'
});
Object.defineProperty(PDFreactor.PdfScriptTriggerEvent, 'OPEN', {
    value: 'OPEN'
});
Object.defineProperty(PDFreactor, 'ProcessingPreferences', {
    value: {}
});
Object.defineProperty(PDFreactor.ProcessingPreferences, 'SAVE_MEMORY_IMAGES', {
    value: 'SAVE_MEMORY_IMAGES'
});
Object.defineProperty(PDFreactor, 'QuirksMode', {
    value: {}
});
Object.defineProperty(PDFreactor.QuirksMode, 'DETECT', {
    value: 'DETECT'
});
Object.defineProperty(PDFreactor.QuirksMode, 'QUIRKS', {
    value: 'QUIRKS'
});
Object.defineProperty(PDFreactor.QuirksMode, 'STANDARDS', {
    value: 'STANDARDS'
});
Object.defineProperty(PDFreactor, 'ResourceType', {
    value: {}
});
Object.defineProperty(PDFreactor.ResourceType, 'ATTACHMENT', {
    value: 'ATTACHMENT'
});
Object.defineProperty(PDFreactor.ResourceType, 'FONT', {
    value: 'FONT'
});
Object.defineProperty(PDFreactor.ResourceType, 'ICC_PROFILE', {
    value: 'ICC_PROFILE'
});
Object.defineProperty(PDFreactor.ResourceType, 'IFRAME', {
    value: 'IFRAME'
});
Object.defineProperty(PDFreactor.ResourceType, 'IMAGE', {
    value: 'IMAGE'
});
Object.defineProperty(PDFreactor.ResourceType, 'MERGE_DOCUMENT', {
    value: 'MERGE_DOCUMENT'
});
Object.defineProperty(PDFreactor.ResourceType, 'OBJECT', {
    value: 'OBJECT'
});
Object.defineProperty(PDFreactor.ResourceType, 'RUNNING_DOCUMENT', {
    value: 'RUNNING_DOCUMENT'
});
Object.defineProperty(PDFreactor.ResourceType, 'SCRIPT', {
    value: 'SCRIPT'
});
Object.defineProperty(PDFreactor.ResourceType, 'STYLESHEET', {
    value: 'STYLESHEET'
});
Object.defineProperty(PDFreactor.ResourceType, 'UNKNOWN', {
    value: 'UNKNOWN'
});
Object.defineProperty(PDFreactor, 'SigningMode', {
    value: {}
});
Object.defineProperty(PDFreactor.SigningMode, 'SELF_SIGNED', {
    value: 'SELF_SIGNED'
});
Object.defineProperty(PDFreactor.SigningMode, 'VERISIGN_SIGNED', {
    value: 'VERISIGN_SIGNED'
});
Object.defineProperty(PDFreactor.SigningMode, 'WINCER_SIGNED', {
    value: 'WINCER_SIGNED'
});
Object.defineProperty(PDFreactor, 'ViewerPreferences', {
    value: {}
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'CENTER_WINDOW', {
    value: 'CENTER_WINDOW'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DIRECTION_L2R', {
    value: 'DIRECTION_L2R'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DIRECTION_R2L', {
    value: 'DIRECTION_R2L'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DISPLAY_DOC_TITLE', {
    value: 'DISPLAY_DOC_TITLE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DUPLEX_FLIP_LONG_EDGE', {
    value: 'DUPLEX_FLIP_LONG_EDGE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DUPLEX_FLIP_SHORT_EDGE', {
    value: 'DUPLEX_FLIP_SHORT_EDGE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'DUPLEX_SIMPLEX', {
    value: 'DUPLEX_SIMPLEX'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'FIT_WINDOW', {
    value: 'FIT_WINDOW'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'HIDE_MENUBAR', {
    value: 'HIDE_MENUBAR'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'HIDE_TOOLBAR', {
    value: 'HIDE_TOOLBAR'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'HIDE_WINDOW_UI', {
    value: 'HIDE_WINDOW_UI'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'NON_FULLSCREEN_PAGE_MODE_USE_NONE', {
    value: 'NON_FULLSCREEN_PAGE_MODE_USE_NONE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'NON_FULLSCREEN_PAGE_MODE_USE_OC', {
    value: 'NON_FULLSCREEN_PAGE_MODE_USE_OC'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'NON_FULLSCREEN_PAGE_MODE_USE_OUTLINES', {
    value: 'NON_FULLSCREEN_PAGE_MODE_USE_OUTLINES'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'NON_FULLSCREEN_PAGE_MODE_USE_THUMBS', {
    value: 'NON_FULLSCREEN_PAGE_MODE_USE_THUMBS'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_ONE_COLUMN', {
    value: 'PAGE_LAYOUT_ONE_COLUMN'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_SINGLE_PAGE', {
    value: 'PAGE_LAYOUT_SINGLE_PAGE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_TWO_COLUMN_LEFT', {
    value: 'PAGE_LAYOUT_TWO_COLUMN_LEFT'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_TWO_COLUMN_RIGHT', {
    value: 'PAGE_LAYOUT_TWO_COLUMN_RIGHT'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_TWO_PAGE_LEFT', {
    value: 'PAGE_LAYOUT_TWO_PAGE_LEFT'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_LAYOUT_TWO_PAGE_RIGHT', {
    value: 'PAGE_LAYOUT_TWO_PAGE_RIGHT'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_FULLSCREEN', {
    value: 'PAGE_MODE_FULLSCREEN'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_USE_ATTACHMENTS', {
    value: 'PAGE_MODE_USE_ATTACHMENTS'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_USE_NONE', {
    value: 'PAGE_MODE_USE_NONE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_USE_OC', {
    value: 'PAGE_MODE_USE_OC'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_USE_OUTLINES', {
    value: 'PAGE_MODE_USE_OUTLINES'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PAGE_MODE_USE_THUMBS', {
    value: 'PAGE_MODE_USE_THUMBS'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PICKTRAYBYPDFSIZE_FALSE', {
    value: 'PICKTRAYBYPDFSIZE_FALSE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PICKTRAYBYPDFSIZE_TRUE', {
    value: 'PICKTRAYBYPDFSIZE_TRUE'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PRINTSCALING_APPDEFAULT', {
    value: 'PRINTSCALING_APPDEFAULT'
});
Object.defineProperty(PDFreactor.ViewerPreferences, 'PRINTSCALING_NONE', {
    value: 'PRINTSCALING_NONE'
});
Object.defineProperty(PDFreactor, 'XmpPriority', {
    value: {}
});
Object.defineProperty(PDFreactor.XmpPriority, 'HIGH', {
    value: 'HIGH'
});
Object.defineProperty(PDFreactor.XmpPriority, 'LOW', {
    value: 'LOW'
});
Object.defineProperty(PDFreactor.XmpPriority, 'NONE', {
    value: 'NONE'
});
Object.defineProperty(PDFreactor, 'VERSION', {
    value: 6
});
module.exports = PDFreactor;
