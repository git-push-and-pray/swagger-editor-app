export const passwordRules = {
  minLength: 8,
  letter: /\p{L}/u,
  digit: /\p{Nd}/u,
  special: /[^\p{L}\p{Nd}\s]/u,
};

export function validatePassword(value: string) {
  return {
    minLength: value.length >= passwordRules.minLength,
    hasLetter: passwordRules.letter.test(value),
    hasDigit: passwordRules.digit.test(value),
    hasSpecial: passwordRules.special.test(value),
  };
}
