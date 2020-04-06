# create an instance of a normalized type

cairo machinery --api-name=computeapi --action=create-normalized-instance  --normalized-api-type-name=vmscalesetnormalized


# create an instance of a versioned type

```
cairo machinery --api-name=computeapi --action=create-versioned-instance --api-version="2018-06-01" --versioned-api-type-name="vmscaleset20180601"
cairo machinery --api-name=computeapi --action=create-versioned-instance --api-version="2018-10-01" --versioned-api-type-name="vmscaleset20181001"
```

# normalize 2018-06-01

```
cairo machinery --api-name=computeapi --action=normalize  --api-version="2018-06-01" --versioned-api-type-name="vmscaleset20180601" --source=./docs_ex/sample-rp-sample-data/compute_rp/vmscaleset_2018-06-01.json
```

# denormalize 2018-06-01

```
cairo machinery --api-name=computeapi --action=denormalize --target-api-version=2018-06-01 --target-versioned-api-type-name=vmscaleset20180601 --source=./docs_ex/sample-rp-sample-data/compute_rp/vmscaleset-normalized.json
```

# normalize 2018-10-01
```
cairo machinery --api-name=computeapi --action=normalize  --api-version="2018-10-01" --versioned-api-type-name="vmscaleset20181001" --source=./docs_ex/sample-rp-sample-data/compute_rp/vmscaleset_2018-10-01.json
```

# denormalize 2018-10-01

```
cairo machinery --api-name=computeapi --action=denormalize --target-api-version=2018-10-01 --target-versioned-api-type-name=vmscaleset20181001 --source=./docs_ex/sample-rp-sample-data/compute_rp/vmscaleset-normalized.json
```


# convert

```
cairo machinery --api-name=computeapi --action=convert --api-version=2018-06-01 --versioned-api-type-name=vmscaleset20180601 --target-api-version=2018-10-01 --target-versioned-api-type-name=vmscaleset20181001 --source=./docs_ex/sample-rp-sample-data/compute_rp/vmscaleset_2018-06-01.json
```
