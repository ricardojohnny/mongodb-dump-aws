# Lambda MongoDB database backup na S3

## Environment variables

| Variable | Description | Required? |
| --- | --- | --- |
| MONGO_DB_NAME | Nome da database | Yes |
| MONGO_USER | Username | Yes |
| MONGO_PW | Password | Yes |
| MONGO_AUTH_DB | Nome usuario autenticacao database | Default eh `admin` |
| MONGO_PORT | Database port | Default eh `27017` |
| MONGO_REPLICA_SET | Nome do replicaset `clustername-shard-0` | Yes |
| MONGO_CLUSTER_SHARD | Nome do Shards `clustername-shard-00-00-xxxxx.mongodb.net,clustername-shard-00-01-xxxxx.mongodb.net,clustername-shard-00-02-xxxxx.mongodb.net` | Yes |
| S3_BUCKET | Nome do S3 bucket | Yes |
| S3_STORAGE_CLASS | S3 storage class | default eh Standard |
| DATE_FORMAT | Formato do arquivo de Backup `[MONGO_DB_NAME]_[DATE_FORMAT]`. Referencia do formato [DAY.JS) | No. Default eh `YYYYMMDD_HHmmss` |
