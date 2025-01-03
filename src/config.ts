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
    secret: string;
}

const config: Config = {
    app: {
        port: 3003,
        env: 'dev', // dev, prod
        hostname: 'http://localhost:3333'
    },
    db: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '',
        name: 'grocery_db',
        debug: false
    },
    secret: 'secretisamythtrytochangeit'
}

export default config;