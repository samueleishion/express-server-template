const moment = require('moment');

const Config = require('@est/config');
const Database = require('@est/bin/dbi');
const Log = require('@est/bin/log');
const Responder = require('@est/bin/responder');
const ObjectID = require('mongodb').ObjectID;

const log = new Log();

const COLLECTION = 'test';
const ENDPOINT = '/api/test';

class Test {
  constructor(dburl, dbname) {
    this.db = new Database(dburl, dbname);
    this.responder = new Responder();
    this.responder.setEndpoint(ENDPOINT);
  }

  static instance(dburl, dbname) {
    return new Test(dburl, dbname);
  }

  get = (req, res) => {
    const data = req.body && Object.keys(req.body).length > 0
      ? req.body
      : req.query && Object.keys(req.query).length > 0
        ? req.query
        : {};

    this.responder.setResponse(res);
    this.responder.setType('get');

    this.db.find(COLLECTION, data, (err, results) => {
      if (err) {
        this.responder.setStatus(500);
        this.responder.setMessage('Error while getting test.');
        this.responder.setError(err);
      } else {
        if (results.length <= 0) {
          this.responder.setStatus(404);
          this.responder.setMessage('Error while getting test.')
          this.responder.setError('No test found.');
          this.responder.setEntry(data);
        } else {
          this.responder.setStatus(200);
          this.responder.setMessage('Found test data.');
          this.responder.setEntry(results);
        }
      }

      this.responder.send();
    });
  };

  post = (req, res) => {
    const data = req.body && Object.keys(req.body).length > 0
      ? req.body
      : null;

    this.responder.setResponse(res);
    this.responder.setType('post');

    if (data !== null) {
      this.db.insert(COLLECTION, data, (err, result) => {
        if (err) {
          this.responder.setStatus(500);
          this.responder.setMessage('Error while adding test.');
          this.responder.setError(err);
        } else {
          this.responder.setStatus(200);
          this.responder.setMessage('Saved test data.');
          this.responder.setEntry(data);
        }

        this.responder.send();
      });
    } else {
      this.responder.setStatus(400);
      this.responder.setMessage('Error while adding test.');
      this.responder.setError('Cannot save empty data object.');
      this.responder.send();
    }
  };

  put = (req, res) => {
    const _id = req.params && 'id' in req.params ? req.params.id : null;
    const data = req.body && Object.keys(req.body).length > 0
      ? req.body
      : req.query && Object.keys(req.query).length > 0
        ? req.query
        : {};

    this.responder.setResponse(res);
    this.responder.setType('put');

    if (_id !== null) {
      this.db.update(COLLECTION, { '_id': ObjectID(_id) }, data, (err, result) => {
        if (err) {
          this.responder.setStatus(500);
          this.responder.setMessage('Error while updating test');
          this.responder.setError(err);
        } else {
          this.responder.setStatus(200);
          this.responder.setMessage('Updated test data.');
          this.responder.setEntry(data);
        }

        this.responder.send();
      });
    } else {
      this.responder.setStatus(400);
      this.responder.setMessage('Error while updating test.');
      this.responder.setError('Please provide a valid test id.');
      this.responder.send();
    }
  };

  delete = (req, res) => {
    this.responder.setResponse(res);
    this.responder.setType('delete');

    this.db.delete(COLLECTION, {}, (err, result) => {
      if (err) {
        this.responder.setStatus(500);
        this.responder.setMessage('Error while deleting test.');
        this.responder.setError(err);
      } else {
        this.responder.setStatus(200);
        this.responder.setMessage('Deleted test data.');
      }

      this.responder.send();
    });
  };
}

module.exports = Test;
