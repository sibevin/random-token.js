import { describe, it, expect } from "vitest";
import * as RandomToken from "../src/index";

describe("RandomToken", () => {
  describe("when no parameter is given", () => {
    it("generates a default length, alphabet-number mixed-casing token", () => {
      const token = RandomToken.gen();
      expect(token.length).toEqual(RandomToken.DEFAULT_TOKEN_SIZE);
      expect(token).toMatch(/^[0-9A-Za-z]+$/);
    });
  });
  describe(".gen", () => {
    describe("(length)", () => {
      it("generates a token with the given length", () => {
        const length = Math.floor(Math.random() * Math.floor(100));
        const token = RandomToken.gen({ length });
        expect(token.length).toEqual(length);
      });
      describe("when no length is given", () => {
        it("generates a token with the default length", () => {
          const token = RandomToken.gen({});
          expect(token.length).toEqual(RandomToken.DEFAULT_TOKEN_SIZE);
        });
      });
    });
    describe("(seed)", () => {
      describe("(seed: null)", () => {
        it("generates an alphabet-number mixed-casing token", () => {
          const token = RandomToken.gen({});
          expect(token).toMatch(/^[0-9A-Za-z]+$/);
        });
      });
      describe("(seed: number)", () => {
        it("generates a number token", () => {
          const seedOptions: RandomToken.Seed[] = [10, 1, "n", "number"];
          seedOptions.forEach((seed) => {
            const token = RandomToken.gen({ seed });
            expect(token).toMatch(/^[0-9]+$/);
          });
        });
        describe("when the casing parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "number", casing: "lower" }),
            ).toThrow(/casing/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "number", friendly: true }),
            ).toThrow(/friendly/);
          });
        });
      });
      describe("(seed: octal)", () => {
        it("generates an octal token", () => {
          const seedOptions: RandomToken.Seed[] = [8, "o", "oct", "octal"];
          seedOptions.forEach((seed) => {
            const token = RandomToken.gen({ seed });
            expect(token).toMatch(/^[0-8]+$/);
          });
        });
        describe("when the casing parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "octal", casing: "lower" }),
            ).toThrow(/casing/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "octal", friendly: true }),
            ).toThrow(/friendly/);
          });
        });
      });
      describe("(seed: binary)", () => {
        it("generates a binary token", () => {
          const seedOptions: RandomToken.Seed[] = [2, "b", "binary"];
          seedOptions.forEach((seed) => {
            const token = RandomToken.gen({ seed });
            expect(token).toMatch(/^[01]+$/);
          });
        });
        describe("when the casing parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "binary", casing: "lower" }),
            ).toThrow(/casing/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "binary", friendly: true }),
            ).toThrow(/friendly/);
          });
        });
      });
      describe("(seed: hexadecimal)", () => {
        it("generates a lowercase hexadecimal token", () => {
          const seedOptions: RandomToken.Seed[] = [
            16,
            "h",
            "hex",
            "hexadecimal",
          ];
          seedOptions.forEach((seed) => {
            const token = RandomToken.gen({ seed });
            expect(token).toMatch(/^[0-9a-f]+$/);
          });
        });
        describe('when the "upper" casing parameter is given', () => {
          it("generates an uppercase hexadecimal token", () => {
            const token = RandomToken.gen({
              seed: "hexadecimal",
              casing: "upper",
            });
            expect(token).toMatch(/^[0-9A-F]+$/);
          });
        });
        describe('when the "mixed" casing parameter is given', () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "hexadecimal", casing: "mixed" }),
            ).toThrow(/casing/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "hexadecimal", friendly: true }),
            ).toThrow(/friendly/);
          });
        });
      });
      describe("(seed: alphabet)", () => {
        it("generates a lowercase alphabet-only token", () => {
          const seedOptions = ["a", "alphabet", "l", "letter"];
          seedOptions.forEach((seed) => {
            const token = RandomToken.gen({ seed });
            expect(token).toMatch(/^[a-zA-Z]+$/);
          });
        });
        describe('when the "upper" casing parameter is given', () => {
          it("generates a uppercase alphabet-only token", () => {
            const token = RandomToken.gen({
              seed: "alphabet",
              casing: "upper",
            });
            expect(token).toMatch(/^[A-Z]+$/);
          });
        });
        describe('when the "mixed" casing parameter is given', () => {
          it("generates a mixed-case alphabet-only token", () => {
            const token = RandomToken.gen({
              seed: "alphabet",
              casing: "mixed",
            });
            expect(token).toMatch(/^[a-zA-Z]+$/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("generates a friendly token", () => {
            const token = RandomToken.gen({ seed: "alphabet", friendly: true });
            RandomToken.FRIENDLY_MASK.split("").forEach((singleMask) => {
              expect(token.split("")).not.toContain(singleMask);
            });
          });
        });
        describe("when the mask parameter is given", () => {
          it("generates a masked token", () => {
            const mask = "abcdefghijk";
            const token = RandomToken.gen({ seed: "alphabet", mask });
            mask.split("").forEach((singleMask) => {
              expect(token.split("")).not.toContain(singleMask);
            });
          });
        });
      });
      describe("(seed: customized)", () => {
        it("generates a token with given seeds", () => {
          const seed = "12345abcdefGHIJK";
          const token = RandomToken.gen({ seed });
          expect(token).toMatch(/^[1-5a-fG-K]+$/);
        });
        describe('when the "upper" casing parameter is given', () => {
          it("generates a uppercase alphabet-only token", () => {
            const seed = "12345abcdefGHIJK";
            const token = RandomToken.gen({ seed, casing: "upper" });
            expect(token).toMatch(/^[1-5A-K]+$/);
          });
        });
        describe('when the "lower" casing parameter is given', () => {
          it("generates a lowercase alphabet-only token", () => {
            const seed = "12345abcdefGHIJK";
            const token = RandomToken.gen({ seed, casing: "lower" });
            expect(token).toMatch(/^[1-5a-k]+$/);
          });
        });
        describe('when the "mixed" casing parameter is given', () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "12345abcdefGHIJK", casing: "mixed" }),
            ).toThrow(/casing/);
          });
        });
        describe("when the friendly parameter is given", () => {
          it("throws an error", () => {
            expect(() =>
              RandomToken.gen({ seed: "12345abcdefGHIJK", friendly: true }),
            ).toThrow(/friendly/);
          });
        });
        describe("when the mask parameter is given", () => {
          it("generates a masked token", () => {
            const seed = "12345abcdefGHIJK";
            const mask = "123abcDEFGHIjk";
            const token = RandomToken.gen({ seed, mask });
            mask.split("").forEach((singleMask) => {
              expect(token.split("")).not.toContain(singleMask);
            });
            expect(token).toMatch(/^[45defJK]+$/);
          });
        });
      });
    });
    describe("(casing)", () => {
      describe("when no casing parameter is given", () => {
        it("generates a mixed-case token by default", () => {
          const token = RandomToken.gen({});
          expect(token).toMatch(/^[0-9A-Za-z]+$/);
        });
      });
      describe('when a "null" casing parameter is given', () => {
        it("generates a mixed-case token", () => {
          const token = RandomToken.gen({ casing: null });
          expect(token).toMatch(/^[0-9A-Za-z]+$/);
        });
      });
      describe('when the "upper" casing parameter is given', () => {
        it("generates an uppercase token", () => {
          const casingOptions: RandomToken.Casing[] = ["u", "upper"];
          casingOptions.forEach((casing) => {
            const token = RandomToken.gen({ casing });
            expect(token).toMatch(/^[0-9A-Z]+$/);
          });
        });
      });
      describe('when the "lower" casing parameter is given', () => {
        it("generates a lowercase token", () => {
          const casingOptions: RandomToken.Casing[] = ["l", "lower"];
          casingOptions.forEach((casing) => {
            const token = RandomToken.gen({ casing });
            expect(token).toMatch(/^[0-9a-z]+$/);
          });
        });
      });
      describe('when the "mixed" casing parameter is given', () => {
        it("generates a mixed-case token", () => {
          const casingOptions: RandomToken.Casing[] = ["m", "mixed"];
          casingOptions.forEach((casing) => {
            const token = RandomToken.gen({ casing });
            expect(token).toMatch(/^[0-9A-Za-z]+$/);
          });
        });
      });
    });
    describe("(friendly)", () => {
      describe("when the friendly parameter is given", () => {
        it("generates a friendly token", () => {
          const token = RandomToken.gen({ friendly: true });
          RandomToken.FRIENDLY_MASK.split("").forEach((singleMask) => {
            expect(token.split("")).not.toContain(singleMask);
          });
        });
      });
    });
    describe("(mask)", () => {
      describe("when the mask parameter is given", () => {
        it("generates a masked token", () => {
          const mask = "123abcDEFGHIjk";
          const token = RandomToken.gen({ mask });
          mask.split("").forEach((singleMask) => {
            expect(token.split("")).not.toContain(singleMask);
          });
        });
      });
    });
  });
  describe(".genf", () => {
    it("applies the friendly option by default", () => {
      const token = RandomToken.genf();
      RandomToken.FRIENDLY_MASK.split("").forEach((singleMask) => {
        expect(token.split("")).not.toContain(singleMask);
      });
    });
    describe("when the seed parameter is given", () => {
      it("throws an error", () => {
        expect(() => RandomToken.genf({ seed: "12345abcdefGHIJK" })).toThrow(
          /friendly/,
        );
      });
    });
  });
});
