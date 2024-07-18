import isEmail from "validator/lib/isEmail";

export const urlCheckRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const isValidEmail = (value:string) => isEmail(value);
export const urlValidator = (url:string) => {
  const urlRegex = /^(https?):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  const parts = url.split('.');

  if (parts.length > 1) {
    const topLevelDomain = parts.pop();
    return urlRegex.test(url) && (!!topLevelDomain && topLevelDomain.length > 1);
  }
  return false;
};
