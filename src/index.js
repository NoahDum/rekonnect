import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import App from "./App";
import SearchRepair from "./pages/SearchRepair";
import Sell from "./pages/Sell";
import Cart from "./pages/Cart";
import Inscription from "./pages/Inscription";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Product from "./pages/Product";
import PostSell from "./pages/PostSell";
import PostRepare from "./pages/PostRepare";
import RepareDetails from "./pages/RepareDetails";
import PasswordForget from "./pages/PasswordForget";
import NewPassword from "./pages/NewPassword";

import dataReducer from './slices';

// Création du store via Redux Toolkit
const store = configureStore({
  reducer: dataReducer,
});

const transition = { duration: 0.8, ease: [0.6, 0.05, 0.2, 0.95] };

const slideLeft = {
  initial: { y: "100%" },
  animate: { y: "0%", transition },
  exit: { y: "-100%", transition },
};

const slideRight = {
  initial: { y: "-100%" },
  animate: { y: "0%", transition },
  exit: { y: "100%", transition },
};

const PageTransition = ({ children, direction }) => {
  return (
    <motion.div
      key={direction}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={direction === "left" ? slideLeft : slideRight}
    >
      {children}
    </motion.div>
  );
};

const Root = () => {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PageTransition key="App" direction="left">
                <App />
              </PageTransition>
            }
          />
          <Route path="/SearchRepair" element={<SearchRepair />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/registered"
            element={
              <PageTransition key="Inscription" direction="right">
                <Inscription />
              </PageTransition>
            }
          />
          <Route
            path="/profile"
            element={
              <PageTransition key="Profile" direction="right">
                <Profile />
              </PageTransition>
            }
          />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/repare-details/:id" element={<RepareDetails />} />
          <Route path="/post-sell" element={<PostSell />} />
          <Route path="/post-repare" element={<PostRepare />} />
          <Route path="/password-forget" element={<PasswordForget />} />
          <Route path="/newpassword" element={<NewPassword />} />
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Root />
  </Provider>
);
