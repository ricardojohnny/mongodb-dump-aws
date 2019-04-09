'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const url = require('url');
const dayjs = require('dayjs');
const ZipFolder = require('zip-a-folder');
const exec = require('child_process').exec;

// VARIAVEIS DE PRASH
// Mongo
const dbName = process.env.MONGO_DB_NAME;
const username = process.env.MONGO_USER;
const password = process.env.MONGO_PW;
const authDB = process.env.MONGO_AUTH_DB || 'admin';
const port = process.env.MONGO_PORT || '27017';
const replicaSet = process.env.MONGO_REPLICA_SET;
const clusterShard = process.env.MONGO_CLUSTER_SHARD;
// S3
const bucketName = process.env.S3_BUCKET;
const storageClass = process.env.S3_STORAGE_CLASS || "STANDARD";
const s3bucket = new AWS.S3({ params: { Bucket: bucketName, StorageClass: storageClass } });

const dateFormat = process.env.DATE_FORMAT || 'YYYYMMDD_HHmmss';

module.exports.handler = function(event, context, cb) {

  console.log(`Backup para a database '${dbName}' na S3 bucket '${bucketName}' iniciou`);
  process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];
  let fileName = dbName + '_' + dayjs().format(dateFormat);
  let folderName = `/tmp/${fileName}/`;
  let filePath = `/tmp/${fileName}.zip`;

  exec(`mongodump -d ${dbName} -u ${username} -p ${password} -o ${folderName} --authenticationDatabase ${authDB} --ssl --port ${port} -h "${replicaSet}/${clusterShard}"`, (error, stdout, stderr) => {

      if (error) {
        console.log('Mongodump falhou: ' + error);
        return;
      }

      ZipFolder.zipFolder(folderName, filePath, function(err) {
        if (err) {
          console.log('ZIP falhou: ', err);
        } else {
          fs.readFile(filePath, function(err, data) {
            s3bucket.upload({ Key: fileName + '.zip', Body: data, ContentType: 'application/zip' }, function(err, data) {
              fs.unlink(filePath, function(err) {
                if (err) {
                  console.log('Nao foi possivel apagar o arquivo tmp: ' + err);
                }
              });
              if (err) {
                console.log('Upload para S3 falhou: ' + err);
              } else {
                console.log('Backup completo!');
              }
            });
          });
        }
      });

    });

};