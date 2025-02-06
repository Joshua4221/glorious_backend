import otpGenerator from "otp-generator";

export const GenerateOpt = async () => {
  const otp = await otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // console.log(otp, "from otp it self");
  return otp;
};

export const GenerateNumberOpt = async () => {
  const otp = await otpGenerator.generate(4, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // console.log(otp, "from otp it self");
  return otp;
};
