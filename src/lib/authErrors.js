export function getAuthErrorMessage(code, messages) {
  const errors = messages?.errors ?? {}
  switch (code) {
    case 'auth/invalid-email':
      return errors.invalidEmail
    case 'auth/user-disabled':
      return errors.userDisabled
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return errors.invalidCredential
    case 'auth/too-many-requests':
      return errors.tooManyRequests
    case 'auth/network-request-failed':
      return errors.network
    default:
      return errors.default
  }
}
