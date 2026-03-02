export const formatPhoneNumberForDisplay = (value) => {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  if (rawValue.includes("@")) {
    return rawValue;
  }

  const digits = rawValue.replace(/\D/g, "");
  if (!digits) {
    return rawValue;
  }

  const formatInTriplets = (numberString) =>
    numberString.replace(/(\d{3})(?=\d)/g, "$1 ");

  if (!rawValue.startsWith("+")) {
    return formatInTriplets(digits);
  }

  const separatedCountryCode = rawValue.match(/^\+(\d{1,3})[\s-]/);
  const countryCodeLength = separatedCountryCode
    ? separatedCountryCode[1].length
    : digits.length <= 10
      ? 1
      : digits.length <= 12
        ? 2
        : 3;

  const countryCode = digits.slice(0, countryCodeLength);
  const nationalNumber = digits.slice(countryCodeLength);

  if (!nationalNumber) {
    return `+${countryCode}`;
  }

  return `+${countryCode} ${formatInTriplets(nationalNumber)}`;
};