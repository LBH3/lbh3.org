export const sortByName = (a, b) => {
  const aHashName = a.hashName;
  const bHashName = b.hashName;
  if (aHashName && !bHashName) {
    return -1;
  } else if (!aHashName && bHashName) {
    return 1;
  }
  const compareHashNames = aHashName.localeCompare(bHashName);
  if (compareHashNames === 0) {
    const compareFamilyNames = a.familyName.localeCompare(b.familyName);
    if (compareFamilyNames === 0) {
      return a.givenName.localeCompare(b.givenName);
    }
    return compareFamilyNames;
  }
  return compareHashNames;
};

export const sortByHashOrJustName = (a, b) => {
  const aName = a.hashOrJustName;
  const bName = b.hashOrJustName;
  return aName.localeCompare(bName);
};

export const sortByPayment = (a, b) => {
  const aPayment = a.paymentNotesAndType;
  const bPayment = b.paymentNotesAndType;
  if (aPayment && !bPayment) {
    return -1;
  } else if (!aPayment && bPayment) {
    return 1;
  }
  const comparePayment = aPayment.localeCompare(bPayment);
  if (comparePayment === 0) {
    return sortByName(a, b);
  }
  return comparePayment;
};
