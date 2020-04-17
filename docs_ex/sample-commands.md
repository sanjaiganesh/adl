# NOTE

API need to be preloaded. Add the following cmdline options with directory updated
```
--pre-load-apis="name=sample_rp+path=/home/khenidak/go/src/github.com/khenidak/adl/sample_rp"
--pre-load-runtimes="path=/home/khenidak/go/src/github.com/khenidak/adl/arm.adl"
```

# Generate swagger for api version 2018-06-01
NOTE: 'format' in --config is optional. Defaults to json if not specified. For yaml, set to 'format=yaml'
```
./cairo generators \
--action=run \
--generator-name=arm.swagger \
--config="version=2020-09-09,format=json"
```

# create an instance of a normalized type

```
./cairo machinery \
--api-name=sample_rp \
--action=create-normalized-instance  \
--normalized-api-type-name=vm
```

# create an instance of a versioned type

```
./cairo machinery \
--api-name=sample_rp \
--action=create-versioned-instance \
--api-version="2020-09-09" \
--versioned-api-type-name="virtualmachine"
```


# normalize

```
./cairo machinery \
--api-name=sample_rp \
--action=normalize  \
--api-version="2020-09-09" \
--versioned-api-type-name="virtualmachine" \
--source=./docs_ex/sample-rp-sample-data/vm_2020-09-09.json
```

## normalize a type that has an imperative versioner
```
./cairo machinery \
--api-name=sample_rp \
--action=normalize  \
--api-version="2020-09-09" \
--versioned-api-type-name="resource-two" \
--source=./docs_ex/sample-rp-sample-data/resource_two_2020-09-09.json
```


# denormalize

```
./cairo machinery \
--api-name=sample_rp \
--action=denormalize \
--target-api-version=2020-09-09 \
--target-versioned-api-type-name=virtualmachine \
--source=./docs_ex/sample-rp-sample-data/vm-normalized.json
```

## denoromalize a type that has an imperative versioner
```
./cairo machinery \
--api-name=sample_rp \
--action=denormalize \
--target-api-version=2020-09-09 \
--target-versioned-api-type-name=resource-two \
--source=./docs_ex/sample-rp-sample-data/resource_two_normalized.json
```

# convert

```
./cairo machinery \
--api-name=sample_rp \
--action=convert \
--api-version=2020-09-09 \
--versioned-api-type-name=virtualmachine \
--target-api-version=2021-09-09 \
--target-versioned-api-type-name=virtualmachine \
--source=./docs_ex/sample-rp-sample-data/vm_2020-09-09.json
```
