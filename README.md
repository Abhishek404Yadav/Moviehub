# 🎬 Moviehub

A sleek React web app to search and explore trending movies using the TMDB API — now enhanced with Appwrite backend logic to track trending movies based on real user searches.

🔗 **Live Demo:** [Moviehub](https://moviehub-sage.vercel.app/)

![License](https://img.shields.io/github/license/Abhishek404Yadav/Moviehub)
![Languages](https://img.shields.io/github/languages/top/Abhishek404Yadav/Moviehub)
![Last Commit](https://img.shields.io/github/last-commit/Abhishek404Yadav/Moviehub)

![Moviehub Screenshot](./public/preview.png)


## 🚀 Features

- 🔍 Live search with 500ms debounce
- 🌐 TMDB API integration
- 📊 Custom trending movies via Appwrite (based on search activity)
- ⚡ Loading spinner and graceful error handling
- 🎨 Responsive UI with Tailwind CSS



## 🛠️ Tech Stack

- React + Vite
- Tailwind CSS
- TMDB API
- Appwrite (Database + SDK)



## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Abhishek404Yadav/Moviehub.git
cd Moviehub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
VITE_API_KEY=your_tmdb_api_key
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
```

> Get your API key from https://www.themoviedb.org/settings/api

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

---

## 📂 Project Structure

```
src/
├── component/
│   ├── Search.jsx
│   ├── MovieCard.jsx
│   └── Loader.jsx
├── appwrite.js 
├── App.jsx
└── main.jsx

```

## 🌟 Future Improvements

- Movie detail modal/page
- Genre-based filtering
- Watchlist feature (using Appwrite or localStorage)
- Dark mode toggle


## 🤝 Contributing

Feel free to fork, create a branch, and submit a pull request.


## 📄 License

Licensed under the [MIT License](LICENSE).

## 👨‍💻 Author

**Abhishek Yadav**  
📧 abhiyadav.ce@gmail.com  
🔗 [GitHub](https://github.com/Abhishek404Yadav)
