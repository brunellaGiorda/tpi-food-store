// Tipo de las variables del .env, para que TypeScript no las tome como any
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}