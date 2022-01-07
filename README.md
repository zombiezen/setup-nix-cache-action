# Set up Nix Cache Action

This is a [GitHub Action][] that configures the [Nix][] package manager
to read from (and optionally write to)
a remote cache.

[GitHub Action]: https://docs.github.com/en/actions
[Nix]: https://nixos.org/

## Usage

Using an [Amazon Web Services S3][] bucket for loading and storing:

```yaml
name: Build
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - name: Check out code
      uses: actions/checkout@v2
    - name: Install Nix
      uses: cachix/install-nix-action@v16
    - name: Set up cache
      uses: zombiezen/setup-nix-cache-action@v0.1.0
      with:
        substituters: s3://example-bucket
        secret_keys: ${{ secrets.NIX_PRIVATE_KEY }}
        aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    - name: Build
      run: nix-build
```

Using a [Google Cloud Storage][] bucket for loading and storing
with the [interoperability endpoint][]:

```yaml
name: Build
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - name: Check out code
      uses: actions/checkout@v2
    - name: Install Nix
      uses: cachix/install-nix-action@v16
    - name: Set up cache
      uses: zombiezen/setup-nix-cache-action@v0.1.0
      with:
        substituters: s3://example-bucket?endpoint=https://storage.googleapis.com
        secret_keys: ${{ secrets.NIX_PRIVATE_KEY }}
        aws_access_key_id: ${{ secrets.GCS_HMAC_ACCESS_ID }}
        aws_secret_access_key: ${{ secrets.GCS_HMAC_SECRET_ACCESS_KEY }}
    - name: Build
      run: nix-build
```

[Amazon Web Services S3]: https://aws.amazon.com/s3/
[Google Cloud Storage]: https://cloud.google.com/storage
[interoperability endpoint]: https://cloud.google.com/storage/docs/interoperability

## Inputs

### `substituters`

(Required) One or more space-separated cache URLs (typically starts with `s3://`)

### `trusted_public_keys`

Space-separated trusted keys for signed downloads.
Not required if a private key is given.

### `secret_keys`

Private keys for signing built artifacts.
If provided, built derivations will be uploaded to the first substituter.

### `aws_access_key_id`

Access key ID for downloading and uploading artifacts

### `aws_secret_access_key`

Secret access key for downloading and uploading artifacts

## License

[Apache 2.0](LICENSE)
