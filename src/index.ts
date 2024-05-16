const DEFAULT_TOKEN_SIZE: number = 16;
const FRIENDLY_MASK: string = "1Ili0OoQDCcG96UuVvEFMN8B";
const NUM_SEEDS: string = "0123456789";
const HEX_SEEDS: string = `abcdef${NUM_SEEDS}`;
const ALPHABET_SEEDS: string = "abcdefghijklmnopqrstuvwxyz";

type Casing = null | "m" | "mixed" | "u" | "upper" | "l" | "lower";
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
  length?: number;
  seed?: Seed;
  casing?: Casing;
  friendly?: boolean;
  mask?: string;
};

function gen(params: RandomTokenParams = {}): string {
  return genToken(params);
}
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
