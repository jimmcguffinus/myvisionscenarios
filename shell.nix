{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.git
    pkgs.openssh
    pkgs.curl
    pkgs.unzip
  ];
}
