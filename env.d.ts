declare namespace NodeJS {
  interface ProcessEnv {
    MONGODB_URI: string;
    JWT_SECRET_KEY: string;

    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_BASE_URL: string;

    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
  }
}
