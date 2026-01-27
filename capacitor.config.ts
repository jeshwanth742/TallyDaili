import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.tallydaili.app',
    appName: 'TallyDaili',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
