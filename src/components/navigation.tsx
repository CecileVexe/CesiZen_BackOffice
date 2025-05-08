import CategoryIcon from "@mui/icons-material/Category";
import IconButton from "@mui/material/IconButton";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import GroupIcon from "@mui/icons-material/Group";
import { NavLink } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";

const Navigation = () => {
  return (
    <nav className="navigation">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir le tableau de bord">
          <InsertChartIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/users" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les utilisateurs">
          <GroupIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/roles" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les rôles">
          <MilitaryTechIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/articles" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les articles">
          <CategoryIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/article-categories" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les catégories d'articles">
          <FolderIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/emotion-categories" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les catégories d'émotions">
          <BookmarkIcon />
        </IconButton>
      </NavLink>
      <NavLink to="/emotions" className={({ isActive }) => (isActive ? "selected" : "")}>
        <IconButton size="large" aria-label="Voir les émotions">
          <ModeCommentIcon />
        </IconButton>
      </NavLink>
      
    </nav>
  );
};
export default Navigation;
