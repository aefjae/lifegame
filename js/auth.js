function showAuthTab(tab) {
  var tabs = document.querySelectorAll('.auth-tab');
  tabs[0].classList.toggle('active', tab === 'signin');
  tabs[1].classList.toggle('active', tab === 'signup');

  document.getElementById('auth-heading').textContent =
    tab === 'signin' ? 'Welcome back.' : 'Create your account.';

  document.getElementById('auth-confirm').style.display =
    tab === 'signup' ? 'block' : 'none';

  document.getElementById('auth-btn-label').textContent =
    tab === 'signin' ? 'Sign In \u2192' : 'Create Account \u2192';
}
