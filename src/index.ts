const DEFAULT_TOKEN_SIZE: number = 16;
const FRIENDLY_MASK: string = "1Ili0OoQDCcG96UuVvEFMN8B";
const NUM_SEEDS: string = "0123456789";
const HEX_SEEDS: string = `abcdef${NUM_SEEDS}`;
const ALPHABET_SEEDS: string = "abcdefghijklmnopqrstuvwxyz";

/**
 * @example
 * ```ts
 * //Use `'u'` (or `'upper'`) to create an uppercase token.
 * RandomToken.gen({ length: 32, casing: 'u' })
 * // 9PO37CS829XBTOJ1FYWBIV51H8JZSR19
 *
 * //Use `'l'` (or `'lower'`) to create a lowercase token.
 * RandomToken.gen({ length: 32, casing: 'l' })
 * // wijjn2hl9dsy6os5yuyshbdlr9n5nlwu
 *
 * //Use `'m'` (or `'mixed'`) to create a mixed-case token. It is the default option for alphabet and random-generated seeds.
 * ```
 */
type Casing = null | "m" | "mixed" | "u" | "upper" | "l" | "lower";

/**
 * @example
 * ```ts
 * // Use `'a'` (or `'alphabet'`, `'l'`, `'letter'`) to create a token with alphabets.
 * RandomToken.gen({ length: 32, seed: 'a' })
 * // NbbtqjmHWJGdibjoesgomGHulEJKnwcI
 *
 * // Use `'n'` (or `'number'`, `10`, `1`) to create a token with numbers.
 * RandomToken.gen({ length: 32, seed: 'n' })
 * // 33541506785847193366752025692500
 *
 * // Use `'b'` (or `'binary'`, `2`) to create a binary token.
 * RandomToken.gen({ length: 32, seed: 'b' })
 * // 11100101111000011100111111001100
 *
 * // Use `'o'` (or `'octal'`, `'oct'`, `8`) to create a octal token.
 * RandomToken.gen({ length: 32, seed: 'o' })
 * // 76032641643460774414624667410327
 *
 * // Use `'h'` (or `'hexadecimal'`, `'hex'`, `16`) to create a hexadecimal token.
 * RandomToken.gen({ length: 32, seed: 'h' })
 * // 07dc6320bf1c03811df7339dbf2c82c3
 *
 * // Use a string to customize random seeds.
 * RandomToken.gen({ length: 32, seed: 'abc' })
 * // bcabcbbcaaabcccabaabcacbcbbabbac
 * ```
 */
type Seed =
  | 10
  | 1
  | "n"
  | "number"
  | 8
  | "o"
  | "oct"
  | "octal"
  | 2
  | "b"
  | "binary"
  | 16
  | "h"
  | "hex"
  | "hexadecimal"
  | "a"
  | "alphabet"
  | "l"
  | "letter"
  | string;

function generateRandomSeedPickFunc(seeds: string) {
  const sampleIndex = Math.floor(Math.random() * Math.floor(seeds.length));
  return seeds[sampleIndex];
}

function generateMixedCasedAlphabetSeeds(casing?: Casing): string {
  let seeds;
  if (!casing || casing === "m" || casing === "mixed") {
    seeds = `${ALPHABET_SEEDS}${ALPHABET_SEEDS.toUpperCase()}`;
  } else {
    seeds = ALPHABET_SEEDS;
  }
  return seeds;
}

function removeMaskedSeeds(seeds: string, mask: string): string {
  const maskRegex = new RegExp(`[${mask}]*`, "g");
  return seeds.replace(maskRegex, "");
}

function filterSeedsWithFriendlyAndMask(
  seeds: string,
  friendly?: boolean,
  mask?: string,
): string {
  let filteredSeeds = seeds;
  if (friendly) {
    filteredSeeds = removeMaskedSeeds(filteredSeeds, FRIENDLY_MASK);
  }
  if (typeof mask === "string") {
    filteredSeeds = removeMaskedSeeds(filteredSeeds, mask);
  }
  return filteredSeeds;
}

function throwInvalidParameterError(params: {
  checkResult: boolean;
  params: string;
  message: string;
}) {
  if (params.checkResult) {
    const errorMsg = `Invalid Parameters: ${params.params}. ${params.message}`;
    throw new Error(errorMsg);
  }
}

const genToken = (params: {
  length?: number;
  seed?: Seed;
  casing?: Casing;
  friendly?: boolean;
  mask?: string;
}) => {
  let givenSeedType:
    | "number"
    | "octal"
    | "binary"
    | "hexadecimal"
    | "alphabet"
    | "customized"
    | "random";
  switch (params.seed) {
    case 10:
    case 1:
    case "n":
    case "number":
      givenSeedType = "number";
      break;
    case 8:
    case "o":
    case "oct":
    case "octal":
      givenSeedType = "octal";
      break;
    case 2:
    case "b":
    case "binary":
      givenSeedType = "binary";
      break;
    case 16:
    case "h":
    case "hex":
    case "hexadecimal":
      givenSeedType = "hexadecimal";
      break;
    case "a":
    case "alphabet":
    case "l":
    case "letter":
      givenSeedType = "alphabet";
      break;
    default: {
      if (typeof params.seed === "string" && params.seed.length > 0) {
        givenSeedType = "customized";
      } else {
        // no seed is given
        givenSeedType = "random";
      }
    }
  }
  if (
    givenSeedType === "number" ||
    givenSeedType === "octal" ||
    givenSeedType === "binary"
  ) {
    throwInvalidParameterError({
      checkResult: params.casing !== undefined,
      params: "casing",
      message: `The casing is not supported with ${givenSeedType} seeds`,
    });
  }
  if (givenSeedType === "hexadecimal" || givenSeedType === "customized") {
    throwInvalidParameterError({
      checkResult: params.casing === "m" || params.casing === "mixed",
      params: "casing",
      message: `The mixed casing is not supported with ${givenSeedType} seeds.`,
    });
  }
  if (givenSeedType !== "alphabet" && givenSeedType !== "random") {
    throwInvalidParameterError({
      checkResult: params.friendly !== undefined,
      params: "friendly",
      message:
        'The friendly mask is supported with alphabet or random-generated seeds (no "seed" is given) only.',
    });
  }
  let randomFunc: () => string;
  switch (givenSeedType) {
    case "number":
      randomFunc = () => Math.floor(Math.random() * Math.floor(10)).toString();
      break;
    case "octal":
      randomFunc = () => Math.floor(Math.random() * Math.floor(8)).toString();
      break;
    case "binary":
      randomFunc = () => Math.floor(Math.random() * Math.floor(2)).toString();
      break;
    case "hexadecimal":
      randomFunc = () => generateRandomSeedPickFunc(HEX_SEEDS);
      break;
    case "alphabet": {
      let seeds = generateMixedCasedAlphabetSeeds(params.casing);
      seeds = filterSeedsWithFriendlyAndMask(
        seeds,
        params.friendly,
        params.mask,
      );
      randomFunc = () => generateRandomSeedPickFunc(seeds);
      break;
    }
    default: {
      // "customized" or "random"
      let seeds = params.seed as string;
      if (givenSeedType === "random") {
        seeds = `${generateMixedCasedAlphabetSeeds(params.casing)}${NUM_SEEDS}`;
      }
      seeds = filterSeedsWithFriendlyAndMask(
        seeds,
        params.friendly,
        params.mask,
      );
      randomFunc = () => generateRandomSeedPickFunc(seeds);
    }
  }
  let generatedToken = Array.from(
    { length: params.length || DEFAULT_TOKEN_SIZE },
    randomFunc,
  ).join("");
  if (params.casing === "u" || params.casing === "upper") {
    generatedToken = generatedToken.toUpperCase();
  } else if (params.casing === "l" || params.casing === "lower") {
    generatedToken = generatedToken.toLowerCase();
  }
  return generatedToken;
};

type RandomTokenParams = {
  /** The token length. If no length is given, {@link DEFAULT_TOKEN_SIZE} is applied. */
  length?: number;

  /** Use predefined seeds defined in {@link Seed} or a string contains seeds for token generation. If no seed is given, the mixed-case alphabets and numbers are applied. */
  seed?: Seed;

  /** The case of generated token. If no casing is given, a mixed-case token is generated. */
  casing?: Casing;

  /** To generate a friendly token which excludes seeds in {@link FRIENDLY_MASK}. */
  friendly?: boolean;

  /** A string contains chars which are not used in token generation. */
  mask?: string;
};

/** Generate a token */
function gen(params: RandomTokenParams = {}): string {
  return genToken(params);
}

/** Generate a friendly token which excludes seeds in {@link FRIENDLY_MASK}. */
function genf(params: RandomTokenParams = {}): string {
  return genToken(Object.assign({ friendly: true }, params));
}

export {
  gen,
  genf,
  RandomTokenParams,
  Seed,
  Casing,
  DEFAULT_TOKEN_SIZE,
  FRIENDLY_MASK,
};
