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
  return db.runSql("ALTER TABLE messages ALTER COLUMN created_at SET DEFAULT NOW()");
};

exports.down = function(db) {
  return db.runSql("ALTER TABLE messages ALTER COLUMN created_at DROP DEFAULT");
};

exports._meta = {
  "version": 1
};
