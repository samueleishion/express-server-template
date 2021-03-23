const MongoClient = require('mongodb').MongoClient;
const Log = require('@est/bin/log');
const log = new Log();

class Database {
  constructor(url, name) {
    this.reset();
    this._url = url;
    this._name = name;
  }

  reset() {
    this._db = null;
    this._err = null;
    this._name = null;
    this._url = null;
    this._wait = [];
  }

  _flatten(obj, pre) {
    const _obj = {};

    Object.keys(obj).map((k, i) => {
      if (obj[k] && typeof obj[k] === 'object') {
        const flat = this._flatten(obj[k], k);
        Object.keys(flat).map((k2, i2) => {
          const k3 = pre && pre.length > 0 ? pre + '.' + k2 : k2;
          _obj[k3] = flat[k2];
        });
      } else {
        const kn = pre && pre.length > 0 ? pre + '.' + k : k;
        _obj[kn] = obj[k];
      }
    });

    return _obj;
  }

  connect(url, name, callback) {
    if (!url) {
      url = this._url;
    }

    if (!name) {
      name = this._name;
    }

    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err, database) => {
        if (err) {
          log.error('Error connecting to DB');
          log.error(err);
          return;
        }

        this._db = database.db(name);

        this._wait.forEach((callback2) => {
          callback2(err, database);
        });

        if (callback && typeof callback === 'function') {
          if (this._db || err) {
            if (!err) {
              callback(this._db, database);
            } else {
              log.error('Error connecting to DB');
              log.error(err);
              database.close();
            }
          } else {
            log.info('Waitin for DB connection...');
            this._wait.push(callback);
          }
        }
      }
    );
  }

  find(collection, data, callback) {
    // data.query
    // data.sort
    // data.limit

    this.connect(this._url, this._name, async (db, client) => {
      const _collection = db.collection(collection);
      const found = await _collection.find(data);

      if (data.sort) {
        found = found.sort(data.sort);
      }

      if (data.limit) {
        found = found.limit(data.limit);
      }

      found.toArray((err, docs) => {
        if (callback && typeof callback === 'function') {
          callback(err, docs, client);
        }
      });
    });
  }

  insert(collection, entry, callback) {
    this.connect(this._url, this._name, (db, client) => {
      const _collection = db.collection(collection);

      _collection.insertOne(entry, (err, result) => {
        if (callback && typeof callback === 'function') {
          callback(err, entry);
          client.close();
        }
      });
    });
  }

  insertMany(collection, array, callback) {
    this.connect(this._url, this._name, (db, client) => {
      const _collection = db.collection(collection);

      _collection.insertMany(array, (err, result) => {
        if (callback && typeof callback === 'function') {
          callback(err, array);
        }
        client.close();
      });
    });
  }

  update(collection, query, entry, callback) {
    this.connect(this._url, this._name, (db, client) => {
      const _collection = db.collection(collection);
      const _entry = {
        $set: this._flatten(entry)
      };

      _collection.updateOne(query, _entry, (err, result) => {
        if (callback && typeof callback === 'function') {
          callback(err, entry);
        }
        client.close();
      });
    });
  }

  delete(collection, entry, callback) {
    this.connect(this._url, this._name, (db, client) => {
      const _collection = db.collection(collection);

      _collection.deleteMany(entry, (err, result) => {
        if (callback && typeof callback === 'function') {
          callback(err, entry);
        }
        client.close();
      });
    });
  }
}

module.exports = Database;
