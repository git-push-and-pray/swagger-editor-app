export function useAuth() {
  return {
    isAuth: false,
    user: null,
    signOut: () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
    },
  };
}
