# Ibani Translator

A modern, AI-powered translation web application for translating English to Ibani language. Built with React, TypeScript, and Tailwind CSS for the frontend, and FastAPI with a Marian MT model for the backend.

![Ibani Translator](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green)

## ✨ Features

- **Single Translation**: Translate individual English texts to Ibani
- **Batch Translation**: Translate multiple texts at once
- **Translation History**: Keep track of your translations with local storage
- **Advanced Options**: Customize translation parameters (max_length, num_beams)
- **Export to CSV**: Download batch translations as CSV files
- **Real-time Status**: Monitor API server health and model status
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **TypeScript**: Full type safety throughout the application

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Access to the Ibani Translation API endpoint

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Endpoint

Create a `.env` file in the root directory:

```bash
cp env.template .env
```

Edit `.env` and set your API endpoint:

```
VITE_API_BASE_URL=http://localhost:8080
```

Or for production:

```
VITE_API_BASE_URL=https://your-api-endpoint.com
```

> **Note:** If you don't create a `.env` file, the app will default to `http://localhost:8080`

### 3. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
ibani-ai/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── StatusIndicator.tsx
│   │   ├── SingleTranslator.tsx
│   │   ├── BatchTranslator.tsx
│   │   └── TranslationHistory.tsx
│   ├── services/           # API services
│   │   └── api.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── .env.example           # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## 📡 API Configuration

This frontend connects to an external Ibani Translation API. The API should provide the following endpoints:

### Health Check
```
GET /health
Response: {
  "status": "healthy",
  "model_loaded": true,
  "model_path": "..."
}
```

### Single Translation
```
POST /translate
Body: {
  "text": "I eat fish",
  "max_length": 128,
  "num_beams": 4
}
Response: {
  "source": "I eat fish",
  "translation": "ịrị olokpó fíị",
  "model": "ibani-translator"
}
```

### Batch Translation
```
POST /batch-translate
Body: {
  "texts": ["Good morning", "Thank you"],
  "max_length": 128,
  "num_beams": 4
}
Response: {
  "translations": [...],
  "count": 2
}
```

### Setting Custom API Endpoint

Set the `VITE_API_BASE_URL` environment variable in your `.env` file or as an environment variable:

```bash
# Development
VITE_API_BASE_URL=http://localhost:8080

# Production
VITE_API_BASE_URL=https://api.yourdomain.com
```

## 🎨 Features in Detail

### Single Translation
- Translate individual English texts with customizable parameters
- Real-time translation with loading states
- Copy translation to clipboard
- Advanced options for fine-tuning translation quality
- Character counter

### Batch Translation
- Translate multiple texts simultaneously (one per line)
- Export results as CSV
- Visual list with numbered items
- Efficient processing of large batches

### Translation History
- Automatic saving to browser's localStorage
- Search through past translations
- Delete individual items or clear all
- Timestamp for each translation
- Persists across browser sessions

### Status Monitoring
- Real-time API health check
- Model loading status
- Visual indicators (green for online, red for offline)
- Auto-refresh every 30 seconds

## 🔧 Configuration

### Environment Variables

The app uses Vite's environment variable system. Create a `.env` file:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

For production builds, set environment variables in your deployment platform (Vercel, Netlify, etc.).

### Tailwind Customization

Customize colors, animations, and more in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

## 📦 Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory. 

### Environment Variables for Production

Set the API endpoint in your deployment platform:

**Vercel:**
```bash
VITE_API_BASE_URL=https://your-api-endpoint.com
```

**Netlify:**
Add to netlify.toml or in the Netlify dashboard.

**Other Platforms:**
Set as environment variables in your hosting platform's settings.

### Deploy to Static Hosting

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Cloudflare Pages

## 🐳 Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t ibani-translator-frontend .
docker run -p 80:80 ibani-translator-frontend
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Marian MT model for translation
- React and the React community
- Tailwind CSS for styling
- FastAPI for the backend framework

## 📞 Support

If you encounter any issues or have questions:

1. Verify the API endpoint is accessible and correctly configured in `.env`
2. Check the browser console for errors
3. Ensure CORS is enabled on your API server
4. Verify all npm dependencies are installed
5. Check the Status Indicator in the app for API connectivity

---

**Made with ❤️ for the Ibani community**

