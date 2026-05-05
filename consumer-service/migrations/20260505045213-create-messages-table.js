'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('messages', {
    id: { type: 'serial', primaryKey: true },
    external_id: { type: 'uuid', unique: true, notNull: true },
    content: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', defaultValue: 'NOW()' },
    sended: { type: 'boolean', defaultValue: false },
  });
};

exports.down = function(db) {
  return db.dropTable('messages');
};

exports._meta = {
  "version": 1
};
