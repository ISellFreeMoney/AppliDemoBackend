module.exports.signUpErrors = (err) => {
  const errors = { pseudo: '', email: '', password: '' };

  if (err.message.includes('pseudo')) {
    errors.pseudo = 'Pseudo incorrect ou déjà pris';
  }

  if (err.message.includes('email')) errors.email = 'Email incorrect';
};
