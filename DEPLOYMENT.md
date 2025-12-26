# Deployment Guide

## Environment Configuration

The Ibani Translator frontend requires the API endpoint to be configured via environment variables.

### Environment Variable

```
VITE_API_BASE_URL=https://your-api-endpoint.com
```

## Deployment Platforms

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variable in Project Settings:
   - Key: `VITE_API_BASE_URL`
   - Value: Your API endpoint URL
4. Deploy

**vercel.json** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api-url"
  }
}
```

### Netlify

1. Push your code to GitHub
2. Import project in Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variable in Site Settings > Environment Variables:
   - Key: `VITE_API_BASE_URL`
   - Value: Your API endpoint URL

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

3. Set `VITE_API_BASE_URL` before building:
```bash
VITE_API_BASE_URL=https://your-api.com npm run build
```

### Docker

**Dockerfile**:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

# Accept build-time argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

**Build and run**:
```bash
# Build
docker build --build-arg VITE_API_BASE_URL=https://your-api.com -t ibani-translator .

# Run
docker run -p 8080:80 ibani-translator
```

### AWS S3 + CloudFront

1. Build the project:
```bash
VITE_API_BASE_URL=https://your-api.com npm run build
```

2. Create S3 bucket and enable static website hosting

3. Upload `dist/` contents to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

4. Create CloudFront distribution pointing to S3 bucket

5. Update DNS to point to CloudFront

### Railway

1. Push to GitHub
2. Import project in Railway
3. Add environment variable:
   - `VITE_API_BASE_URL`: Your API endpoint
4. Deploy automatically

### Render

1. Push to GitHub
2. Create new Static Site in Render
3. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your API endpoint URL

## CORS Configuration

Ensure your API server allows requests from your frontend domain:

```python
# FastAPI example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-frontend-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Custom Domain

After deployment, you can add a custom domain:

1. **Vercel/Netlify**: Add domain in project settings
2. **CloudFront**: Create CNAME record pointing to CloudFront distribution
3. **GitHub Pages**: Add CNAME file to repository root

## Monitoring

Consider adding monitoring and analytics:

- **Vercel Analytics**: Built-in analytics
- **Google Analytics**: Add tracking code
- **Sentry**: Error monitoring
- **LogRocket**: Session replay

## Performance Optimization

The build is already optimized with:
- Code splitting
- Tree shaking
- Minification
- Gzip compression (configure in server)

For better performance:
1. Enable CDN for static assets
2. Configure caching headers
3. Use HTTP/2
4. Enable Brotli compression

