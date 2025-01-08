interface AppConfig {
    port: number;
    env: string;
    hostname: string;
}
interface DBConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    name:string;
    debug: boolean;
}

interface Config {
    app: AppConfig;
    db: DBConfig;
}

const config: Config = {
    app: {
        port: 3000,
        env: 'dev', // dev, prod
        hostname: 'http://localhost'
    },
    db: {
        host: process.env.DB_HOST || 'mysql',  // Use 'db' since Docker Compose resolves service names
        port: 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        name: process.env.DB_NAME || 'grocery_db',
        debug: false
    }
}

export default config;