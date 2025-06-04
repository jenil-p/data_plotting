# PlotPilot 🚀

Welcome to **PlotPilot**, your go-to platform for visualizing data like a pro! 📊 Whether you're a curious **User** or a powerful **Admin**, we've got tools to make your data shine. Built for Excel/CSV uploads, slick charts, and an AI chat buddy, PlotPilot is your data playground! 😎

## What's Inside? 🎉

### For Users 👤
- **Upload Files**: Drop in Excel (`.xlsx`, `.xls`) or CSV (`.csv`) files, up to 10MB. 📁
- **Cool Charts**: Whip up 2D (Bar, Line, Scatter, Pie) or 3D (Bar3D, Line3D, Scatter3D, Surface) graphs. 📈
- **Visualize Data**: Tweak titles, axes, and colors for that perfect look. ✨
- **AI Chat**: Chat with our AI, pre-loaded with your data, for instant insights. 🧠💬

### For Admins 🦸
- **All User Powers**: Do everything a User can. 💪
- **User Control**: Suspend, block, or promote Users to Admins. 🔒👑
- **Rule the Platform**: Keep things smooth and secure. 🛡️

## Tech Stack 🛠️
- **Frontend**: React, Redux, Chart.js, Tailwind CSS 🌐
- **Backend**: Node.js, Express, MongoDB Atlas 🗄️
- **AI**: Together AI for smart data chats 🤖
- **Security**: JWT, Helmet, MongoSanitize 🔐

## Get Started ⚡
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/plotpilot.git
   ```
2. **Install Stuff**:
   ```bash
   cd plotpilot
   npm install
   cd frontend
   npm install
   ```
3. **Set Environment**:
   - Create `.env` in `backend/`:
     ```
     MONGO_URI=your-mongodb-atlas-uri
     JWT_SECRET=your-secret-key
     TOGETHER_AI_API_KEY=your-together-ai-key
     FRONTEND_ORIGIN=http://localhost:3000
     PORT=3000
     ```
4. **Run It**:
   - Backend: `npm start` (from `backend/`)
   - Frontend: `npm start` (from `frontend/`)
5. **Open Browser**: Hit `http://localhost:3000` 🌍

## How to Use 🕹️
- **Users**: Sign up, upload your CSV/Excel file, create charts, and chat with AI for insights. 📊💬
- **Admins**: Log in, manage users (suspend/block/promote), and explore data like a User. 🛠️👀
- **Empty Files?**: Upload files with data to avoid errors. 🚫

## Wanna Help? 🤝
- Fork the repo, make changes, and send a PR! 🖥️
- Report bugs or ideas in [Issues](https://github.com/jenil-p/data_plotting/issues). 🐞

## License 📜
MIT License - Free to use, modify, and share! 🎁

## Say Hi! 👋
- Email: jenilsakriya612@gmail.com

**PlotPilot** - Where data meets dazzle! 🌟
