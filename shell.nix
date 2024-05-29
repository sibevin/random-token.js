{ pkgs ? import (fetchGit {
  url = "https://github.com/NixOS/nixpkgs";
  ref = "refs/tags/23.11";
}) { } }:
pkgs.mkShell { buildInputs = [ pkgs.nodejs_20 ]; }
