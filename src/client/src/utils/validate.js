export default ({ isAuth, values, errors }) => {
  const rules = {
    email: value => {
      if (!value) {
        errors.email = "Введите E-Mail";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        errors.email = "Неверный E-Mail";
      }
    },
    password: value => {
      if (!value) {
        errors.password = "Введите пароль";
      } else if (
        !isAuth &&
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)
      ) {
        errors.password = "Пароль должен включать: 6 или больше символов, минимум одну строчную и одну заглавную буквы";
      }
    },
    password_2: value => {
      if (!isAuth && value !== values.password) {
        errors.password_2 = "Пароли не совпадают";
      } else if (!value) {
        errors.password_2 = "Повторите пароль";
      }
    },
    fullName: value => {
      if (!isAuth && !value) {
        errors.fullName = "Укажите свое имя и фамилию";
      }
    }
  };

  Object.keys(values).forEach(key => rules[key] && rules[key](values[key]));
};
