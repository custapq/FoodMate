function calculateIBW(height, gender) {
  if (gender === "MALE") {
    return height - 100;
  } else if (gender === "FEMALE") {
    return height - 100 - (10 / 100) * (height - 100);
  }
  return 0;
}

function calculatePercentageIBW(weight, ibw) {
  return (weight * 100) / ibw;
}

function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return weight / heightInMeters ** 2;
}

function calculateBMR(weight, height, age, gender) {
  if (gender === "MALE") {
    return 10 * weight + 6.5 * height - 5 * age + 5;
  } else if (gender === "FEMALE") {
    return 10 * weight + 6.5 * height - 5 * age - 161;
  }
  return 0;
}

function calculateTDEE(bmr, exerciseLevel) {
  const exerciseFactors = {
    NONE: 1.2,
    LOW: 1.375,
    MEDIUM: 1.55,
    HIGH: 1.725,
    SPORTMAN: 1.9,
  };
  return bmr * (exerciseFactors[exerciseLevel] || 1.2);
}

export {
  calculateIBW,
  calculatePercentageIBW,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
};
