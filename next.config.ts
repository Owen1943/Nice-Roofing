import type {NextConfig} from 'next';
const config:NextConfig={output:'standalone',poweredByHeader:false,images:{formats:['image/avif','image/webp'],deviceSizes:[480,768,960,1280,1440],imageSizes:[64,128,256],minimumCacheTTL:86400},async headers(){return [{source:'/images/:path*',headers:[{key:'Cache-Control',value:'public, max-age=86400, stale-while-revalidate=604800'},{key:'X-Content-Type-Options',value:'nosniff'}]},{source:'/api/:path*',headers:[{key:'Cache-Control',value:'no-store'}]}];}};
export default config;
