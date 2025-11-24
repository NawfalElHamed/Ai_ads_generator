import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const drawerWidth = 240;
const navItems = ["Generator", "Results", "Logout"];
const neonColor = "#00eaff";

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [active, setActive] = React.useState("Generator");

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleNavClick = (item) => {
    if (item === "Logout") {
      handleLogout();
    } else {
      setActive(item);
      // here later you can navigate based on item if you want
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <img src="/Logo.png" alt="Logo" style={{ height: 60 }} />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => {
          const isActive = active === item;
          return (
            <ListItem key={item}>
              <ListItemButton
                sx={{
                  textAlign: "center",
                  borderRadius: "20px",
                  border: "1px solid",
                  borderColor: isActive ? neonColor : "#333",
                  color: "#fff",
                  backgroundColor: isActive ? "rgba(0, 234, 255, 0.15)" : "transparent",
                  boxShadow: isActive ? `0 0 14px ${neonColor}` : "none",
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: neonColor,
                    boxShadow: `0 0 14px ${neonColor}`,
                    backgroundColor: isActive
                      ? "rgba(0, 234, 255, 0.3)"
                      : "rgba(0, 234, 255, 0.08)",
                  },
                }}
                onClick={() => handleNavClick(item)}
              >
                <ListItemText primary={item} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          mt: 3,
          backgroundColor: "transparent",
          boxShadow: "none",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              component="img"
              src="/Logo.png"
              alt="Logo"
              sx={{ height: 80, width: 80, mr: 1 }}
            />
          </Box>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 2 }}>
            {navItems.map((item) => {
              const isActive = active === item;
              return (
                <Button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  sx={{
                    px: 3,
                    py: 1,
                    fontSize:15,
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: isActive ? neonColor : "#333",
                    color: isActive ? "#000" : "#fff",
                    backgroundColor: isActive ? neonColor : "transparent",
                    boxShadow: isActive ? `0 0 16px ${neonColor}` : "none",
                    transition: "0.2s ease",
                    "&:hover": {
                      borderColor: neonColor,
                      boxShadow: `0 0 16px ${neonColor}`,
                      backgroundColor: isActive
                        ? neonColor
                        : "rgba(0, 234, 255, 0.08)",
                    },
                  }}
                >
                  {item}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>

      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
