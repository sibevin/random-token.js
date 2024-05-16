# Random Token

[![npm version]](https://img.shields.io/npm/v/%40sibevin%2Frandom-token)
[![Doc]](https://img.shields.io/badge/document-blue?link=https%3A%2F%2Fsibevin.github.io%2Frandom-token.js%2F)

A simple way to generate a random token.

## Usage

Import package first

    import * as RandomToken from '@sibevin/random-token'

Use `gen` to create a random token with a given length.

    RandomToken.gen({ length: 32 })
    // JxpwdIA37LlHan4otl55PZYyyZrEdsQT

Some options can help to modify the token format.

    RandomToken.gen({ length: 32, seed: 'alphabet', casing: 'upper', mask: 'ABC', friendly: true })
    // AHMSJZPTDQMBEHQBXEEXPDQRHRKDNJST

Or just simplify as:

    RandomToken.gen({ length: 32, seed: 'a', casing: 'u', mask: 'ABC', friendly: true })
    // DNJERZGWGJQTFYGYWGHAZEBGBRQFPHPF

## Options

### Seed

Use `seed` option to customize the random characters. Here are available options:

Use `'a'` (or `'alphabet'`, `'l'`, `'letter'`) to create a token with alphabets.

    RandomToken.gen({ length: 32, seed: 'a' })
    // NbbtqjmHWJGdibjoesgomGHulEJKnwcI

Use `'n'` (or `'number'`, `10`, `1`) to create a token with numbers.

    RandomToken.gen({ length: 32, seed: 'n' })
    // 33541506785847193366752025692500

Use `'b'` (or `'binary'`, `2`) to create a binary token.

    RandomToken.gen({ length: 32, seed: 'b' })
    // 11100101111000011100111111001100

Use `'o'` (or `'octal'`, `'oct'`, `8`) to create a octal token.

    RandomToken.gen({ length: 32, seed: 'o' })
    // 76032641643460774414624667410327

Use `'h'` (or `'hexadecimal'`, `'hex'`, `16`) to create a hexadecimal token.

    RandomToken.gen({ length: 32, seed: 'h' })
    // 07dc6320bf1c03811df7339dbf2c82c3

Use a string to customize random seeds.

    RandomToken.gen({ length: 32, seed: 'abc' })
    // bcabcbbcaaabcccabaabcacbcbbabbac

### Casing

Use `casing` option to modify the token case. Here are available options:

Use `'u'` (or `'upper'`) to create an uppercase token.

    RandomToken.gen({ length: 32, casing: 'u' })
    // 9PO37CS829XBTOJ1FYWBIV51H8JZSR19

Use `'l'` (or `'lower'`) to create a lowercase token.

    RandomToken.gen({ length: 32, casing: 'l' })
    // wijjn2hl9dsy6os5yuyshbdlr9n5nlwu

Use `'m'` (or `'mixed'`) to create a mixed-case token. It is the default option for alphabet and random-generated seeds. Note that the mixed-casing is not supported with customized seeds.

    RandomToken.gen({ length: 32, seed: 'abc', casing: 'm' })
    // Error: Invalid Parameters: casing. The mixed casing is not supported with customized seeds.

Casing is not supported with following `seed` options: `'number'`, `'binary'`, `'octal'`.

    RandomToken.genf({ length: 32, seed: 'number', casing: 'l' })
    // Error: Invalid Parameters: casing. The casing is not supported with number seeds

### Mask

Use `mask` option to filter characters which you don't want to appear on the generated token.

    RandomToken.gen({ length: 32, mask: '123abcABC' })
    // vhZp88dKzRZGxfQHqfx7DOL8jKTkWUuO

### Friendly

Use `friendly` option to remove the ambiguous characters, the default mask includes _1, I, l, i, 0, O, o, Q, D, C, c, G, 9, 6, U, u, V, v, E, F, M, N, 8, B_.

    RandomToken.gen({ length: 32, friendly: true })
    // hTTSgXdHzy5wkymnd3qjR44LXLp43qrY

The default `friendly` option is false. There is a convenient method `genf` using `friendly: true` by default.

    RandomToken.genf({ length: 32 })
    // aTjkzhnZm75zZPt45nT3jHgnrmRmzbkY

Note that the friendly option is supported with alphabet or random-generated seeds (no 'seed' is given) only.

    RandomToken.genf({ length: 32, seed: 'abc' })
    // Error: Invalid Parameters: friendly. The friendly mask is supported with alphabet or random-generated seeds (no "seed" is given) only.

## Test

    npm run test

## Authors

Sibevin Wang

## Copyright

Copyright (c) 2019-2024 Sibevin Wang. Released under the MIT license.
