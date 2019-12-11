module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return age;
  },
  date(timestamp) {
    const date = new Date(timestamp);
    // yyyy
    const year = date.getUTCFullYear();
    // mm
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    // dd
    const day = `0${date.getUTCDate()}`.slice(-2);
    // yyyy/mm/dd
    return {
      day,
      month,
      year,
      iso: `${year}-${month}-${day}`,
      birthDay: `${day}/${month}`,
      format: `${day}/${month}/${year}`,
    };
  },
};
