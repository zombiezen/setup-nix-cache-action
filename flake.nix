{
  description = "GitHub Action that configures the Nix package manager to read from (and optionally write to) a remote cache.";

  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        packages.nodejs = pkgs.nodejs_20;

        devShells.default = pkgs.mkShell {
          packages = [
            self.packages.${system}.nodejs
          ];
        };

        checks.precommit = pkgs.stdenvNoCC.mkDerivation {
          name = "setup-nix-cache-action-precommit";

          src = ./.;

          __impure = true;

          nativeBuildInputs = [
            pkgs.coreutils
            self.packages.${system}.nodejs
          ];

          buildPhase = ''
            runHook preBuild
            export HOME="$(mktemp -d)"
            npm install
            patchShebangs --build node_modules pre-commit.sh
            ./pre-commit.sh
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            touch "$out"
            runHook postInstall
          '';
        };

        checks.test = pkgs.stdenvNoCC.mkDerivation {
          name = "setup-nix-cache-action-test";

          src = ./.;

          __impure = true;

          nativeBuildInputs = [
            pkgs.coreutils
            self.packages.${system}.nodejs
          ];

          buildPhase = ''
            runHook preBuild
            export HOME="$(mktemp -d)"
            npm install
            patchShebangs --build node_modules
            npm test
            runHook postBuild
          '';

          installPhase = ''
            runHook preInstall
            touch "$out"
            runHook postInstall
          '';
        };
      }
    );
}
