export function useAuth() {
  return {
    isAuth: true,
    user: null,
    signOut: () => {},
  };
}
