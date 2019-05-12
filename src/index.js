const DEFAULT_TOKEN_SIZE = 16
const FRIENDLY_MASK = '1Ili0OoQDCcG96UuVvEFMN8B'
const NUM_SEEDS = '0123456789'
const HEX_SEEDS = `abcdef${NUM_SEEDS}`
const ALPHABET_SEEDS = 'abcdefghijklmnopqrstuvwxyz'

const generateRandomSeedPickFunc = (seeds) => {
  const sampleIndex = Math.floor(Math.random() * Math.floor(seeds.length))
  return seeds[sampleIndex]
}

const generateMixedCasedAlphabetSeeds = (casing) => {
  let seeds
  if (casing === null || casing === 'm' || casing === 'mixed') {
    seeds = `${ALPHABET_SEEDS}${ALPHABET_SEEDS.toUpperCase()}`
  } else {
    seeds = ALPHABET_SEEDS
  }
  return seeds
}

const removeMaskedSeeds = (seeds, mask) => {
  const maskRegex = new RegExp(`[${mask}]*`, 'g')
  return seeds.replace(maskRegex, '')
}

const filterSeedsWithFriendlyAndMask = (seeds, friendly, mask) => {
  let filteredSeeds = seeds
  if (friendly) {
    filteredSeeds = removeMaskedSeeds(filteredSeeds, FRIENDLY_MASK)
  }
  if (typeof mask === 'string') {
    filteredSeeds = removeMaskedSeeds(filteredSeeds, mask)
  }
  return filteredSeeds
}

const throwInvalidParameterError = ({ checkResult, params, message }) => {
  if (checkResult) {
    const errorMsg = `Invalid Parameters: ${params}. ${message}`
    throw new Error(errorMsg)
  }
}

export const RandomToken = {
  gen: ({
    length = DEFAULT_TOKEN_SIZE,
    seed = null,
    casing = null,
    friendly = false,
    mask = null,
  }) => {
    let givenSeedType
    switch (seed) {
      case 10:
      case 1:
      case 'n':
      case 'number':
        givenSeedType = 'number'
        break
      case 8:
      case 'o':
      case 'oct':
      case 'octal':
        givenSeedType = 'octal'
        break
      case 2:
      case 'b':
      case 'binary':
        givenSeedType = 'binary'
        break
      case 16:
      case 'h':
      case 'hex':
      case 'hexadecimal':
        givenSeedType = 'hexadecimal'
        break
      case 'a':
      case 'alphabet':
      case 'l':
      case 'letter':
        givenSeedType = 'alphabet'
        break
      default: {
        if (typeof seed === 'string') {
          givenSeedType = 'customized'
        } else { // no seed is given
          givenSeedType = 'random'
        }
      }
    }
    if (
      givenSeedType === 'number'
      || givenSeedType === 'octal'
      || givenSeedType === 'binary'
    ) {
      throwInvalidParameterError({
        checkResult: casing !== null,
        params: 'casing',
        message: `The casing is not supported with ${givenSeedType} seeds`,
      })
    }
    if (givenSeedType === 'hexadecimal' || givenSeedType === 'customized') {
      throwInvalidParameterError({
        checkResult: (casing === 'm' || casing === 'mixed'),
        params: 'casing',
        message: `The mixed casing is not supported with ${givenSeedType} seeds.`,
      })
    }
    if (givenSeedType !== 'alphabet' && givenSeedType !== 'random') {
      throwInvalidParameterError({
        checkResult: friendly,
        params: 'friendly',
        message: 'The friendly mask is supported only with alphabet or random-generated seeds (no "seed" is given).',
      })
    }
    let randomFunc
    switch (givenSeedType) {
      case 'number':
        randomFunc = () => Math.floor(Math.random() * Math.floor(10))
        break
      case 'octal':
        randomFunc = () => Math.floor(Math.random() * Math.floor(8))
        break
      case 'binary':
        randomFunc = () => Math.floor(Math.random() * Math.floor(2))
        break
      case 'hexadecimal':
        randomFunc = () => generateRandomSeedPickFunc(HEX_SEEDS)
        break
      case 'alphabet': {
        let seeds = generateMixedCasedAlphabetSeeds(casing)
        seeds = filterSeedsWithFriendlyAndMask(seeds, friendly, mask)
        randomFunc = () => generateRandomSeedPickFunc(seeds)
        break
      }
      default: {
        let seeds
        if (givenSeedType === 'customized') {
          seeds = seed
        } else { // no seed is given
          seeds = `${generateMixedCasedAlphabetSeeds(casing)}${NUM_SEEDS}`
        }
        seeds = filterSeedsWithFriendlyAndMask(seeds, friendly, mask)
        randomFunc = () => generateRandomSeedPickFunc(seeds)
      }
    }
    let generatedToken = Array.from({ length }, randomFunc).join('')
    if (casing === 'u' || casing === 'upper') {
      generatedToken = generatedToken.toUpperCase()
    } else if (casing === 'l' || casing === 'lower') {
      generatedToken = generatedToken.toLowerCase()
    }
    return generatedToken
  },
  DEFAULT_TOKEN_SIZE,
  FRIENDLY_MASK,
}

export { RandomToken as default }
