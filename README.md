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
      uses: actions/checkout@v4
    - name: Install Nix
      uses: cachix/install-nix-action@v23
    - name: Set up cache
      uses: zombiezen/setup-nix-cache-action@v0.3.2
      with:
        substituters: s3://example-bucket
        secret_keys: ${{ secrets.NIX_PRIVATE_KEY }}
        aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    - name: Build
      run: nix-build
```

Using a [Google Cloud Storage][] bucket for loading and storing:

```yaml
name: Build
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - name: Check out code
      uses: actions/checkout@v4
    - name: Install Nix
      uses: cachix/install-nix-action@v23
    - name: Authenticate to Google Cloud Platform
      # See https://github.com/google-github-actions/auth/blob/main/README.md
      # for details on how to set up.
      uses: google-github-actions/auth@v1
    - name: Set up cache
      uses: zombiezen/setup-nix-cache-action@v0.3.2
      with:
        substituters: gs://example-bucket
        secret_keys: ${{ secrets.NIX_PRIVATE_KEY }}
        use_nixcached: true
    - name: Build
      run: nix-build
```

The example above uses [nixcached][] to connect to Google Cloud Storage
using normal service account credentials.
If you prefer to avoid the dependency, you can instead use the [interoperability endpoint][],
but you will have to generate an HMAC key:

```yaml
# Connecting to GCS without nixcached (not recommended).

name: Build
jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
    - name: Check out code
      uses: actions/checkout@v4
    - name: Install Nix
      uses: cachix/install-nix-action@v23
    - name: Set up cache
      uses: zombiezen/setup-nix-cache-action@v0.3.2
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
[nixcached]: https://github.com/zombiezen/nixcached

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

### `use_nixcached`

If `true`, use [nixcached][] for uploading and downloading.
This permits concurrent uploading and more straightforward authentication.

## License

[Apache 2.0](LICENSE)
