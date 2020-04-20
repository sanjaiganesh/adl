# NOTE

API need to be preloaded. Add the following cmdline options with directory updated
```
--pre-load-apis="name=Microsoft.Compute+path=f:\adl\compute_rp" \
--pre-load-runtimes="path=f:\adl\arm.adl" 
```

# Generate swagger for api version 2018-06-01
NOTE: 'format' in --config is optional. Defaults to json if not specified. For yaml, set to 'format=yaml'
```
./cairo -a=info generators \
--action=run \
--generator-name=arm.openapi \
--config="apimodel=Microsoft.Compute,version=2018-06-01,format=yaml"
```

# create an instance of a normalized type

```
./cairo machinery \
--api-name=Microsoft.Compute
--action=create-normalized-instance
--normalized-api-type-name=vmscalesetnormalized
```

# create an instance of a versioned type (2018-06-01)

```
./cairo machinery \
--api-name=Microsoft.Compute
--action=create-versioned-instance
--api-version="2018-06-01"
--versioned-api-type-name="vmscaleset20180601"
```

# create an instance of a versioned type (2018-06-01)

```
./cairo machinery \
--api-name=Microsoft.Compute
--action=create-versioned-instance
--api-version="2018-10-01"
--versioned-api-type-name="vmscaleset20181001"
```

# normalize 2018-06-01

```
./cairo machinery \
--api-name=Microsoft.Compute \
--action=normalize \
--api-version="2018-06-01" \
--versioned-api-type-name="vmscaleset20180601" \
--source=./docs_ex/compute-rp-sample-data/vmscaleset_2018-06-01.json
```

# denormalize 2018-06-01

```
./cairo machinery \
--api-name=Microsoft.Compute \
--action=denormalize \
--target-api-version=2018-06-01 \
--target-versioned-api-type-name=vmscaleset20180601 \
--source=./docs_ex/compute-rp-sample-data/vmscaleset-normalized.json \
```

# normalize 2018-10-01
```
./cairo machinery \
--api-name=Microsoft.Compute \
--action=normalize \
--api-version="2018-10-01" \
--versioned-api-type-name="vmscaleset20181001" \
--source=./docs_ex/compute-rp-sample-data/vmscaleset_2018-10-01.json \
```

# denormalize 2018-10-01

```
./cairo machinery \
--api-name=Microsoft.Compute \
--action=denormalize \
--target-api-version=2018-10-01 \
--target-versioned-api-type-name=vmscaleset20181001 \
--source=./docs_ex/compute-rp-sample-data/vmscaleset-normalized.json
```

# convert

```
./cairo machinery \
--api-name=Microsoft.Compute \
--action=convert \
--api-version=2018-06-01 \
--versioned-api-type-name=vmscaleset20180601 \
--target-api-version=2018-10-01 \
--target-versioned-api-type-name=vmscaleset20181001 \
--source=./docs_ex/compute-rp-sample-data/vmscaleset_2018-06-01.json
```
