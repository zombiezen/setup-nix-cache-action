{
  description = "GitHub Action that configures the Nix package manager to read from (and optionally write to) a remote cache.";

  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "flake-utils";
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
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
      }
    );
}
